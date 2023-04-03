import React from "react"
import css from "../css/zp104_同步目录.css"

const HH = ["H1", "H2", "H3", "H4", "H5", "H6"]

function render(ref) {
    if (!ref.H || ref.H.length < 3) return <i/>
    observe(ref)
    return <React.Fragment><i className="ink"/><ol>{ref.LI.map((a, i) => 
        <li onClick={evt => click(ref, evt.currentTarget)} className={"h" + a.l} key={i}>{a.txt}</li>
    )}</ol></React.Fragment>
}

function init(ref) {
    const { props, id } = ref
    ref.article = $("." + (props.article || "zarticle"))
    if (!ref.article) return ref.exc('warn("未找到文章")')
    ref.offset = props.offset || 0
    ref.io = new IntersectionObserver(entries => entries.forEach(x => {
        if (x.boundingClientRect.y > 200 || x.boundingClientRect.y < -200) return
        let ol = $("#" + id + " ol")
        if (!ol) return
        const idx = ref.H.indexOf(x.target)
        Array.from($$("#" + id + " li.cur")).forEach(a => a.classList.remove("cur"))
        let li = ol.children[idx]
        if (li) li.classList.add("cur")
        if (li) $("#" + id + " .ink").style.top = (li.offsetHeight * (idx + 0.5) - 4) + "px"
    }), { rootMargin: -ref.offset + "px 0px" })
    observe(ref)
}

function observe(ref) {
    const H = ref.H
    ref.H = []
    ref.LI = []
    loop(ref, ref.article)
    if (ref.H.length < 3) return
    setTimeout(() => {
        if (H && ref.H[ref.H.length - 1] !== H[H.length - 1]) H.forEach(a => {
            ref.io.unobserve(a)
            delete a.zp104
        })
        ref.H.forEach(a => {
            if (!a.zp104) {
                ref.io.observe(a)
                a.zp104 = true
            }
        })
    }, 200)
}

function destroy(ref) {
    ref.io && ref.io.disconnect()
}

function loop(ref, e) {
    if (e.children) Array.from(e.children).forEach(a => {
        if (HH.includes(a.nodeName)) {
            ref.H.push(a)
            ref.LI.push({ l: HH.indexOf(a.nodeName) + 1, txt: a.textContent })
        }
        loop(ref, a)
    })
}

function click(ref, li) {
    const arr = Array.from(ref.article.querySelectorAll(li.classList[0]))
    const H = arr.find(a => a.textContent === li.textContent)
    if (!H) return
    window.scrollTo(0, ref.exc("offsetTop(H)", { H }) - ref.offset)
    setTimeout(() => {
        Array.from($$("#" + ref.id + " li.cur")).forEach(a => a.classList.remove("cur"))
        li.classList.add("cur")
        const idx = ref.H.indexOf(H)
        $("#" + ref.id + " .ink").style.top = (li.offsetHeight * (idx + 0.5) - 4) + "px"
    }, 9)
}

$plugin({
    id: "zp104",
    props: [{
        prop: "article",
        type: "text",
        label: "文章类名"
    }, {
        prop: "offset",
        type: "number",
        label: "偏移量(px)"
    }],
    render,
    init,
    destroy,
    css
})