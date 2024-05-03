import {ButtonHTMLAttributes} from "react";
import "./button.css"

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement>{
    label: string,
    primary?: boolean,
}

export const Button = ({label, primary, ...rest} : IButton) => {
    return <button className={`btn ${primary ? 'btn-primary' : 'btn-secondary'}`} {...rest}>{label}</button>
}