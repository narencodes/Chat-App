import store from '../mainStore';

const _tooltipTimeout = 100;

const getTooltipProps = (el, arg) => ({
    el,
    content : el._content,
    direction : arg || 'top' // default direction
});

const isTooltipShown = () => !!store.state.tooltipProps;

const getToolTipEl = () => isTooltipShown() && store.state.tooltipProps.el;

const bindTooltip = (el, { value, arg, modifiers : { elips } }) => {
    if (!value || el._content === value) {
        return !value && unbindTooltip(el);
    }
    el._content = value;
    if (!el._mouseenter) {
        el._mouseenter = (ev) => {
            if(ev.target !== el) {
                return;
            }
            el._timeout = setTimeout(() => {
                console.log(el.scrollWidth, el.clientWidth);
                let showToolTip = !elips || (el.scrollWidth > el.clientWidth); // Decides to show tooltip on all cases or only for ellipsis         
                showToolTip && store.commit('setTooltip', getTooltipProps(el, arg));
            }, _tooltipTimeout);
        }
        el.addEventListener('mouseenter', el._mouseenter);
        el._mouseleave = () => {
            clearTimeout(el._timeout);
            isTooltipShown() && store.commit('setTooltip');
        }
        el.addEventListener('mouseleave', el._mouseleave)
    }
};

let unbindTooltip = el => {
    if (getToolTipEl() === el) {
        isTooltipShown() && store.commit('setTooltip');
    }
    if (el._mouseleave) {
        el.removeEventListener('mouseleave', el._mouseleave);
        delete el._mouseleave;
    }
    if (el._mouseenter) {
        el.removeEventListener('mouseenter', el._mouseenter); 
        delete el._mouseenter;
    }
}

let tooltip = {
    bind: bindTooltip,    
    update: bindTooltip,
    unbind : unbindTooltip
}

export default tooltip;