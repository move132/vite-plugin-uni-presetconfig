/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
const pkg = require(path.join(process.cwd(), 'package.json'))
// const getRouters = require(path.join(__dirname, 'router'))
import getRouters from './router'
const options = require(path.join(process.cwd(), pkg['cli-config'].configFile || 'config'))
const envName = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'
const envConfig = require(path.join(process.cwd(), 'config', 'env', `${envName}.js`))
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
		routers: JSON.stringify(getRouters.routes),
		routesMap: JSON.stringify(getRouters.routesMap),
		routesLinkMap: JSON.stringify(getRouters.routesLinkMap),
		barIconRouters: JSON.stringify(getRouters.barIconRouters),
		barIconLinkRouters: JSON.stringify(getRouters.barIconLinkRouters),
		envConfig: JSON.stringify(envConfig),
		...options.defineConstants
	}
}
