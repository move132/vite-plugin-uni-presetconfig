export interface Config {
	includes: string[] // 路由表需要包含的字段
}

// 默认配置
const CONFIG: Config = {
	includes: ['meta', 'path', 'aliasPath', 'name']
}

/**
 * 将pages.json转换为routes数组。
 *
 * @param {any} pagesJson - pages.json对象
 * @param {Config} config - 配置对象
 * @returns {Record<string, any>[]} 转换后的routes数组
 */
export function pagesJsonToRoutes(pagesJson: any, config?: Config) {
	if (config && config.includes) {
		CONFIG.includes = Array.from(new Set([...CONFIG.includes, ...config.includes]))
	}
	return getPagesRoutes(pagesJson.pages).concat(getNotMpRoutes(pagesJson.subPackages))
}

/**
 * 通过读取pages.json文件生成直接可用的routes。
 *
 * @param {any[]} pages - pages.json文件中的页面数组
 * @param {string | null} rootPath - 根路径（可选）
 * @return {Record<string, any>[]} 生成的routes数组
 */
function getPagesRoutes(pages: any[], rootPath: string | null = null) {
	return pages.map((item) => {
		const route: Record<string, any> = {}
		for (const key of CONFIG.includes) {
			let value = item[key]
			if (key === 'path') {
				value = rootPath ? `/${rootPath}/${value}` : `/${value}`
			}
			if (key === 'aliasPath' && item === pages[0] && rootPath === null) {
				route[key] = route[key] || '/'
			} else if (value !== undefined) {
				route[key] = value
			}
		}
		return route
	})
}
/**
 * 解析小程序分包路径
 *
 * @param {any[]} subPackages - 小程序分包数组
 * @return {any[]} 解析后的路由数组
 */
function getNotMpRoutes(subPackages: any[]) {
	return subPackages.flatMap((item: any) => getPagesRoutes(item.pages, item.root))
}
