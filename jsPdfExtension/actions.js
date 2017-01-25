r = require('ramda')

function text(doc, options) {
	return normalizeInput({
			doc,
			options
		})
		.then(textFormat)
		.then(normalizeInput)
		.then(textAlign)
		.then(borderFormat)
		.then(print)
}


function normalizeInput(input) {

	input.options = input.options || {}
	if(input.options.txtArray) input.options.txtArray = Array.isArray(input.options.txtArray) ? input.options.txtArray : [input.options.txtArray]
	input.options.x = input.options.x || 0
	input.options.y = input.options.y || 0
	input.options.lineSpacing = input.options.lineSpacing || 0.2

	input.pageWidth = input.doc.internal.pageSize.width
	input.fontSize = input.doc.internal.getFontSize()
	input.textWidth = input.options.txtArray.map(txt => input.doc.getStringUnitWidth(txt) * input.fontSize / input.doc.internal.scaleFactor)
	input.textHeigth = input.options.txtArray.map(txt => input.fontSize * 0.328) // 0.3528 = mm/pt
	input.xCoord = input.textWidth.map(w => input.options.x)
	input.yCoord = input.textHeigth.map((h, index) => {
		if (index > 0) {
			return input.options.y + input.textHeigth[0]+input.textHeigth.slice(0, index).reduce((a, b) => a + b)
		} else {
			return input.options.y + input.textHeigth[0]
		}
	})
	//console.log(input)
	return Promise.resolve(input)

}

function textFormat(input) {
	let xCoord = clone(input.xCoord),
		yCoord = clone(input.yCoord)
	if (input.options.lineSpacing) yCoord = input.yCoord.map((y, i) => i > 0 ? y +i*input.options.lineSpacing*input.textHeigth[i] : y)
	if(input.options.fontSize) input.doc.setFontSize(input.options.fontSize)
	if(input.options.fontFamily && input.options.fontStyle) input.doc.setFont(input.options.fontFamily, input.options.fontStyle)
	if(input.options.fontFamily) input.doc.setFont(input.options.fontFamily)

	let resultParams = {
		xCoord,
		yCoord
	}
	return Promise.resolve(r.merge(input, {
		textParams: resultParams,
	}))
}

function textAlign(input){
	if (input.options.align === 'center') input.textParams.xCoord = input.textWidth.map(w => (input.pageWidth - w) / 2)
	return Promise.resolve(input)
}


function borderFormat(input) {
	let xCoord = clone(input.textParams.xCoord),
		yCoord = clone(input.textParams.yCoord)
	if (input.options.border) {
		let xBorder = xCoord.map(x => x),
			yBorder = yCoord.map((y, i) => y - input.textHeigth[i]),
			borderWidth = input.textWidth.map(w => w),
			borderHeight = input.textHeigth.map(h => h)

		if (input.options.title) {

		}
		if (input.options.padding) {
			xBorder = xBorder.map(x => x - (input.options.padding / 2))
			yBorder = yBorder.map(y => y - (input.options.padding / 2))
			borderWidth = borderWidth.map(w => w + input.options.padding)
			borderHeight = borderHeight.map(h => h + input.options.padding)

		}
		return Promise.resolve(r.merge(input, {
			borderParams: {
				xBorder,
				yBorder,
				borderWidth,
				borderHeight
			}
		}))
	} else return Promise.resolve(input)
}





function print(input) {
	if (input.textParams) input.options.txtArray.forEach((txt, i) => input.doc.text(input.textParams.xCoord[i], input.textParams.yCoord[i], txt))
	if (input.borderParams) input.options.txtArray.forEach((txt, i) => input.doc.rect(input.borderParams.xBorder[i],input.borderParams.yBorder[i],input.borderParams.borderWidth[i],input.borderParams.borderHeight[i]))
	return Promise.resolve(input)
//input.borderParams.xCoord[i], input.borderParams.yCoord[i], input.borderParams.borderWidth,input.borderParams.borderHeight
}

function saveDoc(input) {
	input.doc.save('test.pdf', (err) => console.log('saved'))
}


function clone(array) {
	if (Array.isArray(array)) return array.slice(0)
	else return undefined
}

module.exports = {
	text,
	print,
	saveDoc,
}