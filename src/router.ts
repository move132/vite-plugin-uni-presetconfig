/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs'
import path from 'path'
const pkg = require(path.join(process.cwd(), 'package.json'))

if (!(pkg && pkg['cli-config'])) {
	throw new Error('package.json 里缺少 cli-config')
}
const cliConfig = pkg['cli-config']

if (!cliConfig.routeFile) {
	cliConfig.routeFile = path.join('.', 'config', 'routes')
}
const routerFileDir = path.join(process.cwd(), cliConfig.routeFile)
export interface Config {
	subPackages?: any
	routes: RouterPageData[]
	routesMap: any
	routesLinkMap: any
	subPackMap: any
	barIconRouters: any
	barIconLinkRouters: any
	pages: Array<any>
	homePath: any
	tabBar: Array<any>
}

interface RouterPageData {
	fileName: string
	subRoot: string
	routers: RouterLinkData[]
}
interface RouterLinkData {
	name: string
	src: string
	key: string
	barIcon?: string
	index?: number
	isLogin?: boolean
	isHome?: boolean
	isShare?: boolean
}
const config: Config = {
	routes: [],
	routesMap: {},
	routesLinkMap: {},
	subPackMap: {},
	barIconRouters: {},
	barIconLinkRouters: {},
	pages: [],
	homePath: {},
	tabBar: []
}
const routesList: RouterPageData[] = []
const notSubPackage = []

const routesDir = fs.readdirSync(routerFileDir)

// 只遍历一层
for (const item of routesDir) {
	const routesItemFileDir = path.join(routerFileDir, item)
	const stat = fs.statSync(routesItemFileDir)
	if (stat.isFile()) {
		const fileItemInfo = require(routesItemFileDir)
		routesList.push(fileItemInfo.default ? fileItemInfo.default : fileItemInfo)
	}
}
routesList.forEach((item) => {
	item.routers.forEach((listItem) => {
		const first = listItem.key.slice(0, 1).toUpperCase()
		const mapKey = `${item.fileName}${first}${listItem.key.slice(1, listItem.key.length)}`
		config.routesMap[mapKey] = {
			mapKey,
			...listItem
		}
		// 如果是子包
		if (item.subRoot) {
			config.routesMap[mapKey].linkPath = `${item.subRoot}/pages/${listItem.src}`
			if (notSubPackage.includes(process.env.UNIAPP_ENV)) {
				// 查看当前小程序是否支持拆包 不支持那么就把子包打到主包里
				config.pages.push({path: config.routesMap[mapKey].linkPath, name: mapKey})
			} else if (config.subPackMap[item.subRoot]) {
				// 查看是否之前有过当前key的数组
				config.subPackMap[item.subRoot].pages.push({path: listItem.src, name: mapKey})
			} else {
				config.subPackMap[item.subRoot] = {
					root: `${item.subRoot}/pages`,
					pages: [{path: listItem.src, name: mapKey}]
				}
			}
		} else {
			// 如果是主包
			config.routesMap[mapKey].linkPath = `pages/${listItem.src}`
			config.pages.push({path: config.routesMap[mapKey].linkPath, name: mapKey})
		}

		// 有barIcon代表需要底部bar
		if (listItem.barIcon) {
			config.routesMap[mapKey].barIcon = listItem.barIcon
			config.routesMap[mapKey].index = listItem.index
			config.barIconRouters[mapKey] = config.routesMap[mapKey]
			// 给主包tabBar的文件
			config.tabBar.push({pagePath: config.routesMap[mapKey].linkPath, name: mapKey})
		}

		if (listItem.isHome) {
			config.homePath = {path: config.routesMap[mapKey].linkPath, name: mapKey}
		}
	})
})

if (config.homePath) {
	config.pages = config.pages.filter((pageItem) => pageItem.path !== config.homePath.path)
	config.pages.unshift({path: config.homePath.path, name: config.homePath.name})
}
// 做一个path的mapping
for (const key in config.routesMap) {
	const item = config.routesMap[key]
	config.routesLinkMap[item.linkPath] = item
}
// 做一个path的mapping
for (const key in config.barIconRouters) {
	const item = config.barIconRouters[key]
	config.barIconLinkRouters[item.linkPath] = item
}

config.subPackages = Object.values(config.subPackMap)
export default config
