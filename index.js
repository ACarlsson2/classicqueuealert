const screenshot = require('screenshot-desktop');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const Jimp = require("jimp")
const https = require('https')
const { EVENT_NAME, IFTTT_KEY } = require("./constants")


const X_PIXEL = 1000
const Y_PIXEL = 590

const takeScreenShot = async (name) => {
   await screenshot({ filename: `./${name}.png` })
}

const createDiff = () => {
    const img1 = PNG.sync.read(fs.readFileSync('screen_initial.png'));
    const img2 = PNG.sync.read(fs.readFileSync('screen_new.png'));
    const {width, height} = img1;
    const diff = new PNG({width, height});

    pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.4});

    fs.writeFileSync('diff.png', PNG.sync.write(diff));
}

const compareDiff = () => {
    Jimp.read("diff.png", function (err, image) {
        const rawColor = image.getPixelColor(X_PIXEL, Y_PIXEL); // returns the colour of that pixel e.g. 0xFFFFFFFF
        const RGBAColor = Jimp.intToRGBA(rawColor)
        if ( RGBAColor.r === 255) {
            makeHTTPRequest()
        }
        console.log("pixelColor", RGBAColor)
    });
}

const makeHTTPRequest = () => {
    const options = {
        hostname: 'maker.ifttt.com',
        path: `/trigger/${EVENT_NAME}/with/key/${IFTTT_KEY}`,
        method: 'GET'
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            process.stdout.write(d)
        })
    })

    req.on('error', error => {
        console.error(error)
    })

    req.end()
}

const main = async () => {
    console.log("taking initial photo")
    await takeScreenShot("screen_initial")

    setInterval(async () => {
        console.log("taking new photo")
        await takeScreenShot("screen_new")
        createDiff()
        compareDiff()
    }, 5000)
}

module.exports = main()




