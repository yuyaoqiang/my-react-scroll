export let defalutOption = {
    scrollY: true, // 横向
    pullDownRefresh: {
        threshold: 80,
        stop: 40,
        stopTime: 0
    },
    pullUpLoad: { threshold: -60 },
    startY: 0,
    bounce: true
};
export let mergeOptions = function(options) {
    
    return {...options,...defalutOption};
};