export function animate(func, duration) {
    let start = null;
    loop(function(timestamp) {
        if (!start)
                start = timestamp;
        
        if (timestamp - start < duration) {
                func(timestamp - start);
                return true;
        }

        return false;
    });
}

export function easeInOutQuad(progress, start, delta, duration) {
    progress /= duration / 2;
    if (progress < 1)
            return (progress * progress * (delta / 2)) + start;
    --progress;
    return (((progress * (progress - 2)) - 1) * (-delta / 2)) + start;
}

export function loop(func) {
    window.requestAnimationFrame(function frame(timestamp) {
            if (func(timestamp))
                window.requestAnimationFrame(frame);
    });
}

export function pick(array) {
        return array[Math.floor(Math.random() * array.length)];
}

export function removeChildren(element) {
        while (element.firstChild)
                element.firstChild.remove();
}

export function scroll(target, duration) {
    let start = scrollTop();
    animate(ProgressEvent => {
            let y = easeInOutQuad(progress, start, target - start, duration);
            window.scroll(0, Math.round(y));
    }, duration);
}

export function scrollTop(element) {
    if (!element) 
            return window.pageYOffset;
    
    let y = 0;
    while (element) {
            y += element.offsetTop;
            element = element.offsetParent;
    }
    return y;
}

export function sum(object, initialValue = 0) {
        return Object.values(object).reduce((accumulator, item) => accumulator + item, initialValue);
}