/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import path from 'path'
// import {parse} from 'comment-json'
import pxtoRpx from 'postcss-pxtorpx-pro'
import config from './config'
// const pkg = require(path.join(process.cwd(), 'package.json'))

interface PostcssPxToViewportOptions {
	unit?: 'rpx'
	unitPrecision?: number
	selectorBlackList?: string[]
	propBlackList?: string[]
	replace?: boolean
	mediaQuery?: boolean
	minPixelValue?: number
	exclude?: RegExp
	transform?: (x: any) => number
}
interface PluginsOptions {
	pxtorpxConfig: PostcssPxToViewportOptions
}
const defaultOptions: PostcssPxToViewportOptions = {
	// 转化的单位
	unit: 'rpx',
	// 单位精度
	unitPrecision: 5,
	// 不需要处理的css选择器
	selectorBlackList: [],
	// 不需要转化的css属性
	propBlackList: [],
	// 直接修改px，还是新加一条css规则
	replace: true,
	// 是否匹配媒介查询的px
	mediaQuery: false,
	// 需要转化的最小的pixel值，低于该值的px单位不做转化
	minPixelValue: 2,
	// 不处理的文件
	exclude: /node_modules|componentsIgno/gi,
	// 转化函数
	// 视口375px
	transform: (x: any) => (750 / 375) * x
}
export default function uniPresetConfig(options?: PluginsOptions) {
	const pxtorpxSetting = pxtoRpx({...defaultOptions, ...options?.pxtorpxConfig})
	return {
		name: 'uniPresetConfig',
		config: (e) => {
			e.css = {
				postcss: {
					plugins: [pxtorpxSetting]
				}
			}
			e.define = {
				...config.defineConstants
			}
			const {subPackages, pages, tabBar} = config.routers

			/* const url = path.join(process.cwd(), pkg['cli-config'].sourceDir || 'src', 'routes.json')
			const data = JSON.stringify({subPackages: subPackages, pages: pages, tabBar: tabBar}, null, 2)
			fs.writeFileSync(url, data) */

			/* const pagesJsonUrl = path.join(process.cwd(), 'src', 'pages.json')
			const pagesJson = fs.readFileSync(pagesJsonUrl, 'utf-8') */
			const options = require(path.join(process.cwd(), 'config'))
			const pagesPath = path.join(process.cwd(), 'src', 'pages.json')
			const pagesJsonMerge = JSON.stringify({...options?.pages, subPackages, pages}, null, 2)
			fs.writeFileSync(pagesPath, pagesJsonMerge)
		},
		configResolved(config) {}
	}
}
