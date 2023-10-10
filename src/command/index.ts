#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Created by agile move on 2023/10/7
 */

import * as path from 'path'
import yargs from 'yargs'
import shell from 'shelljs'
import fs from 'fs'
import config from '../config'
// import {exec} from 'child_process'
// const pkg = require(path.join(process.cwd(), 'package.json'))

const isDev = process.env.APP_ENV !== 'prod'
const command = [`cross-env NODE_ENV=${isDev ? 'development' : 'production'} APP_ENV=${process.env.APP_ENV}`]
const globalData = {...config.defineConstants}
const pagesPath = path.join('./', 'global.json')
const pagesJsonMerge = JSON.stringify(globalData, null, 2)
fs.writeFileSync(pagesPath, pagesJsonMerge)

/* if (!(pkg['cli-config'] && pkg['cli-config'].platform)) {
		throw new Error('package.json 里缺少 cli-config 或 cli-config 缺少 platform 请检查')
	} */
// 去执行 uni 命令
command.push(`uni build`)
// 如果是DEV 那么就watch
if (isDev || yargs.argv.watch) {
	command.push('-w')
}
command.push('-p mp-weixin')
console.log(command.join(' '), 999)
// 使用命令行执行命令
shell.exec(command.join(' '))
