export default function IntroFormElement(props) {
    function setValue(e) {
        setTimeout(props.setVal(e.target.value), 2000)
    }

    return (
        <label className="enter__label">
            <span className="enter__text">{props.text}</span>
            <input type="text" id={props.cssId} className="enter__input" autoComplete="off" onChange={setValue} />
            <span className={
                (props.dataHasError)
                    ? `enter__error error-${props.cssId}`
                    : `hidden enter__error error-${props.cssId}`
            }>{props.errorText}</span>
        </label>
    )
}
