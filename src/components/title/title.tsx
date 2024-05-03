import "./title.css"
export const Title = ({title, img} : {title: string, img: string}) => {
    return (
        <div className="title">
            <img alt="logo app" width="115" height="115" src={img}/>
            <h1>  {title.split('').map((char, key) => (
                <span key={`title-${key}`}>{char}</span>
            ))}</h1>

        </div>
    )
}