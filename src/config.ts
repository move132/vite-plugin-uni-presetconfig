/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
const pkg = require(path.join(process.cwd(), 'package.json'))
import getRouters from './router'
import {pagesJsonToRoutes} from './utils'
const options = require(path.join(process.cwd(), pkg['cli-config'].configFile || 'config'))
const envConfig = require(path.join(process.cwd(), 'config', 'env', `${process.env.APP_ENV}.js`))
const isDev = process.env.APP_ENV !== 'prod'
export default {
	deviceRatio: {
		640: 2.34 / 2,
		750: 1,
		828: 1.81 / 2,
		...options.deviceRatio
	},
	routers: getRouters,
	defineConstants: {
		isDev: JSON.stringify(isDev),
		miniRouters: JSON.stringify(pagesJsonToRoutes(getRouters)), // 小程序mini-routers
		globalRouters: JSON.stringify(getRouters),
		routesMap: JSON.stringify(getRouters.routesMap),
		routesLinkMap: JSON.stringify(getRouters.routesLinkMap),
		barIconRouters: JSON.stringify(getRouters.barIconRouters),
		barIconLinkRouters: JSON.stringify(getRouters.barIconLinkRouters),
		envConfig: JSON.stringify(envConfig),
		...options.defineConstants
	}
}
