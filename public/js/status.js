var urlParams = new URLSearchParams(window.location.search)

let state = urlParams.get('status') || 'new'

if (!['new', 'out'].includes(state)) {
    let notice = document.getElementById('status_notice')
    notice.style.display = 'block'

    if (state != 'fail') notice.classList.add('is-warning')
    else notice.classList.add('is-danger')
    
    notice.innerText = `STATUS ${state}`

    err = urlParams.get('err') || "none"
    if (err != "none") {
        notice.innerText = notice.innerText + `\nERR ${err}`
        console.warn(err)
    }
}