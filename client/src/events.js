const events = {
    emit: (identifier, data) => {
        const e = new CustomEvent(identifier, {detail: data});
    
        document.dispatchEvent(e)
    },
    emitOn: ($, identifier, data) => {
        const e = new CustomEvent(identifier, {detail: data});
        
        $.dispatchEvent(e)
    }
}

export default events;