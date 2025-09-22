var urlParams = new URLSearchParams(window.location.search)

let state = urlParams.get('status') || 'new'

let p = document.getElementById('status_notice')

p.innerText = `STATUS ${state}`

err = urlParams.get('err') || "none"
if (err != "none") {
    p.innerText = p.innerText + `\nERR ${err}`
    console.warn(err)
}