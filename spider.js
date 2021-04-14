const express = require("express")
const http = require('https')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const fs = require('fs')
const app = express()
let results = []

for (let i = 0; i <= 10; i++) {
	http.get('https://www.qcc.com/g_GD_440300_' + i, res => {
		let html = ''
		res.on('data', data => {
			html += data
		})

		res.on('end', () => {
			const text = filterHtmlList(html)
			results.push(...text)
			writeTxt(results)
		})
	}).on('error', () => {
		console.log('获取数据出错')
	})
}
function filterHtmlList (html) {
	if (html) {
		const $ = cheerio.load(html)
		const diypage = $('#searchlist')
		const htmlListData = []

		diypage.find('tr').each((index, element) => {
			let title = $(element).find('.ma_h1').text().trim()
			let name = $(element).find('.text-primary').text().trim()
			let address = $(element).find('p:last-child').text().trim()
			htmlListData.push({
				title,
				name,
				address
			})
		})
		// console.log(htmlListData)
		return htmlListData
	} else {
		console.log('无数据传入')
	}
}

function writeTxt (file) {
	let str = JSON.stringify(file)
	fs.writeFile('./result.txt', str, error => {
		if (error) {
			console.log('写入失败')
		} else {
			console.log('写入成功')
		}
	})
}
