import "./info.css"
export const Info = ({info} : {info: string}) => {
    return (
        <div className="info">
            <p>{info}</p>
        </div>
    )
}