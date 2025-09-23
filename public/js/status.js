var urlParams = new URLSearchParams(window.location.search)

let state = urlParams.get('status') || 'new'

if (state != 'new') {
    let notice = document.getElementById('status_notice')
    
    notice.innerText = `STATUS ${state}`

    err = urlParams.get('err') || "none"
    if (err != "none") {
        notice.innerText = notice.innerText + `\nERR ${err}`
        console.warn(err)
    }

}