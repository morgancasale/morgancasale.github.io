import { css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

export const mainStyle = css`
    .container{
        display: flex;
        height: 100%;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;
        background-color: #131929;
    }

    .img_cont{
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
    }

    .model_name{
        color: white;
        font-size: 5vw;
    }

    .btn_cont{
        display: flex;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
    }

    .model{
        display: flex;
        flex-wrap: wrap;
    }

    button{
        width: 200px;
        height: 200px;
        font-size: 35px;
    }
`