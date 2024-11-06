export const LeftNav = (props : { className? : string}) => {
    return (
    <svg className={props.className ? props.className : ''} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="47.5114" cy="48.4562" r="47.4928" fill="#B44137"/>
        <path d="M14.3164 44.4874C12.5282 46.2755 12.5282 49.1747 14.3164 50.9628L43.4556 80.1021C45.2438 81.8902 48.1429 81.8902 49.931 80.1021C51.7192 78.3139 51.7192 75.4148 49.931 73.6267L24.0295 47.7251L49.931 21.8235C51.7192 20.0354 51.7192 17.1363 49.931 15.3481C48.1429 13.56 45.2438 13.56 43.4556 15.3481L14.3164 44.4874ZM77.4681 43.1463L17.5541 43.1463L17.5541 52.3039L77.4681 52.3039L77.4681 43.1463Z" fill="#E9E8E6"/>
    </svg>
    )
}