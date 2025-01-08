const service_uuid = '19b10000-e8f2-537e-4f6c-d104768a1214';
const toDeviceMsgChar_uuid = '19b10001-e8f2-537e-4f6c-d104768a1214';
const deviceCmdChar_uuid = '19b10003-e8f2-537e-4f6c-d104768a1214';
const deviceStateChar_uuid = '19b10004-e8f2-537e-4f6c-d104768a1214';

const button_alert_time = 2500;
const ble_msg_cooldown = 100;

const connect_icon = `
    <svg slot="icon" viewBox="0 0 24 24">
        <path d="M4.93,4.93C3.12,6.74 2,9.24 2,12C2,14.76 3.12,17.26 4.93,19.07L6.34,17.66C4.89,16.22 4,14.22 4,12C4,9.79 4.89,7.78 6.34,6.34L4.93,4.93M19.07,4.93L17.66,6.34C19.11,7.78 20,9.79 20,12C20,14.22 19.11,16.22 17.66,17.66L19.07,19.07C20.88,17.26 22,14.76 22,12C22,9.24 20.88,6.74 19.07,4.93M7.76,7.76C6.67,8.85 6,10.35 6,12C6,13.65 6.67,15.15 7.76,16.24L9.17,14.83C8.45,14.11 8,13.11 8,12C8,10.89 8.45,9.89 9.17,9.17L7.76,7.76M16.24,7.76L14.83,9.17C15.55,9.89 16,10.89 16,12C16,13.11 15.55,14.11 14.83,14.83L16.24,16.24C17.33,15.15 18,13.65 18,12C18,10.35 17.33,8.85 16.24,7.76M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z" />
    </svg>
`;

const disconnect_icon = `
    <svg slot="icon" width="24px" height="24px" viewBox="-3.5 0 19 19">
        <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"/>
    </svg>
`;

const warning_icon = `
    <svg slot="icon" viewBox="0 0 24 24" >
        <path d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z"/>
        <polygon points="13,16 11,16 11,18 13,18"/>
        <polygon points="13,10 11,10 11,15 13,15"/>
    </svg>
`;

const power_icon = `
    <svg slot="icon" viewBox="-3 -2.5 24 24">
        <path d="M12 4.1a.973.973 0 0 1-.617-.898c0-.536.448-.972 1-.972.116 0 .228.02.332.055.001-.003.002-.004.004-.003C15.834 3.658 18 6.708 18 10.252 18 15.082 13.97 19 9 19s-9-3.917-9-8.749C0 6.732 2.137 3.7 5.218 2.31a1.022 1.022 0 0 1 .392-.076c.552 0 1 .435 1 .971a.972.972 0 0 1-.61.896c-2.365 1.092-4 3.436-4 6.15 0 3.758 3.134 6.805 7 6.805s7-3.047 7-6.805c0-2.714-1.635-5.058-4-6.15zM9 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1z"/>
    </svg>
`;

const orange_icon = `
    <svg slot="icon" height="24px" width="24px" viewBox="0 0 1024 1024" >
        <path d="M510.75072 539.4944m-472.18176 0a472.18176 472.18176 0 1 0 944.36352 0 472.18176 472.18176 0 1 0-944.36352 0Z" fill="#FF7100"/>
        <path d="M508.78976 219.22816c-20.6848-44.63616 19.46624-107.20256 89.68704-139.74528 70.21568-32.54272 143.90784-22.7328 164.59776 21.90336L508.78976 219.22816z" fill="#30C03F"/>
        <path d="M508.78976 219.22816c20.6848 44.63616 94.37696 54.44608 164.59776 21.90336 70.21568-32.54272 110.37184-95.104 89.68704-139.74528L508.78976 219.22816z" fill="#97CF43"/>
        <path d="M370.32448 220.49792m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M254.208 313.6768m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M743.41376 281.06752m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M859.53024 388.224m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M767.06816 434.816m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M631.59296 346.65472m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M878.16704 565.26848m-23.6544 0a23.6544 23.6544 0 1 0 47.3088 0 23.6544 23.6544 0 1 0-47.3088 0Z" fill="#FFA05F"/>
        <path d="M504.02304 224.35328s-27.4944-173.22496-8.24832-192.47104 33.90976-12.17024 41.24672-5.49888c15.12448 13.7472-16.49664 159.47776-16.49664 178.72384 0 19.24608-8.24832 38.49216-16.50176 19.24608z" fill="#5A4530"/>
        <path d="M460.36992 221.66016s33.19808-5.24288 54.16448 0c20.9664 5.24288 22.71232 6.9888 26.20928 12.23168 3.49184 5.24288-24.45824 3.49184-24.45824 3.49184s-19.22048-5.24288-31.44704-5.24288H463.872s-13.98272-5.23776-3.50208-10.48064z" fill="#5A4530"/>
    </svg>
`;

const lemon_icon = `
    <svg slot="icon" width="24px" height="24px" viewBox="0 0 36 36" >
        <path fill="#5C913B" d="M11.405 3.339c6.48-1.275 8.453 1.265 11.655.084c3.202-1.181.093 2.82-.745 3.508c-.84.688-8.141 4.809-11.307 3.298c-3.166-1.511-3.182-6.186.397-6.89z"/>
        <path fill="#77B255" d="M15.001 16a.998.998 0 0 1-.801-.4c-.687-.916-1.308-1.955-1.965-3.056C9.967 8.749 7.396 4.446.783 2.976a1 1 0 1 1 .434-1.952C8.671 2.68 11.599 7.581 13.952 11.519c.63 1.054 1.224 2.049 1.848 2.881a1 1 0 0 1-.799 1.6z"/>
        <path fill="#FFCC4D" d="M34.3 31.534c.002-.017-.003-.028-.003-.043c2.774-5.335 2.647-15.113-3.346-21.107c-5.801-5.8-13.68-5.821-18.767-4.067c-1.579.614-2.917.066-3.815.965c-.881.881-.351 2.719-.714 3.819c-3.169 5.202-3.405 13.025 2.688 19.117c4.962 4.962 10.438 6.842 19.98 4.853c.002-.002.005-.001.008-.002c1.148-.218 2.95.523 3.566-.094c1.085-1.085.309-2.358.403-3.441z"/>
        <path fill="#77B255" d="M8.208 6.583s-4.27-.59-6.857 4.599c-2.587 5.188.582 9.125.29 12.653c-.293 3.53 1.566 1.265 2.621-.445s4.23-4.895 4.938-9.269c.707-4.376-.07-6.458-.992-7.538z"/>
    </svg>
`;

const apple_icon = `
    <svg slot="icon" width="24px" height="24px" viewBox="0 0 1024 1024" >
    <path d="M576 106.666667s-64 65.493333-64 192.746666" fill="#FFFFFF"/>
    <path d="M512 299.413333S485.333333 32 213.333333 128c29.333333 278.229333 298.666667 171.413333 298.666667 171.413333z" fill="#4CAF50"/>
    <path d="M134.08 553.258667C94.293333 338.474667 253.418667 123.669333 512 299.413333c258.581333-175.744 417.706667 39.061333 377.92 253.824C850.154667 768.042667 631.338667 969.685333 512 826.624c-119.338667 143.061333-338.154667-58.581333-377.92-273.365333z" fill="#D32F2F"/>
    <path d="M690.816 277.333333c-46.72 0-98.816 19.306667-154.837333 57.365334L512 350.997333v409.024l32.768 39.274667c18.346667 22.016 39.189333 32.725333 63.68 32.725333 84.458667 0 210.133333-127.808 239.509333-286.549333 15.018667-81.024-2.325333-163.413333-45.248-215.04C773.802667 295.701333 735.104 277.333333 690.816 277.333333z" fill="#FFF3E0"/>
    <path d="M672 559.082667a42.666667 42.666667 0 0 1-85.333333 0c0-23.573333 42.666667-72.832 42.666666-72.832s42.666667 49.28 42.666667 72.832z" fill="#5D4037"/>
    <path d="M512 299.413333C253.418667 123.669333 94.293333 338.474667 134.08 553.258667 173.845333 768.042667 392.661333 969.685333 512 826.624V299.413333z" fill="#F44336"/>
    </svg>
`;

const cube_icon = `
    <svg slot="icon" heigth="24px" width="24px" viewBox="0 0 56 56">
        <path d="M 7.5860 42.7422 L 25.9844 53.1953 C 27.3438 53.9687 28.6094 53.9922 30.0157 53.1953 L 48.4141 42.7422 C 50.5938 41.5000 51.7890 40.2344 51.7890 36.8359 L 51.7890 18.2734 C 51.7890 15.6719 50.7580 14.1953 48.8360 13.0937 L 32.2657 3.6719 C 29.3829 2.0078 26.5704 2.0312 23.7344 3.6719 L 7.1641 13.0937 C 5.2422 14.1953 4.2110 15.6719 4.2110 18.2734 L 4.2110 36.8359 C 4.2110 40.2344 5.4063 41.5000 7.5860 42.7422 Z M 28.0000 26.0312 L 10.1407 15.9297 L 25.3985 7.2109 C 27.1797 6.2031 28.7735 6.1797 30.6016 7.2109 L 45.8595 15.9297 Z M 9.7891 39.4609 C 8.4532 38.7109 8.0079 37.9843 8.0079 36.7187 L 8.0079 19.2343 L 26.0313 29.5234 L 26.0313 48.6953 Z M 46.2110 39.4609 L 29.9688 48.6953 L 29.9688 29.5234 L 47.9922 19.2343 L 47.9922 36.7187 C 47.9922 37.9843 47.5468 38.7109 46.2110 39.4609 Z"/>
    </svg>
`;

const cylinder_icon = `
    <svg slot="icon" heigth="24" width="24" viewBox="0 0 512 512">
        <path d="M196.33 384.894c-.928-6.466-6.925-10.952-13.394-10.028-20.788 2.986-39.636 7.193-56.018 12.498-6.217 2.014-9.623 8.686-7.609 14.903 1.621 5.005 6.262 8.189 11.254 8.189 1.208 0 2.437-.187 3.649-.58 15.104-4.893 32.63-8.791 52.089-11.587 6.467-.93 10.958-6.926 10.029-13.395m188.759 2.476c-16.377-5.306-35.224-9.512-56.015-12.501-6.467-.932-12.466 3.56-13.395 10.029s3.56 12.465 10.029 13.395c19.463 2.797 36.988 6.697 52.087 11.589 1.212.393 2.441.58 3.649.58 4.992 0 9.633-3.184 11.254-8.188 2.014-6.217-1.392-12.891-7.609-14.904m-100.767-16.788a560 560 0 0 0-56.63 0c-6.527.335-11.545 5.897-11.21 12.424s5.888 11.551 12.424 11.21a537 537 0 0 1 54.206 0q.31.016.616.015c6.257 0 11.483-4.907 11.807-11.226.333-6.527-4.688-12.088-11.213-12.423"/>
        <path d="M386.434 17.948C351.42 6.374 305.097 0 256 0s-95.421 6.374-130.437 17.948C75.469 34.506 64.955 55.975 64.955 71.069V440.93c0 15.094 10.515 36.563 60.61 53.122C160.58 505.626 206.903 512 256 512s95.42-6.374 130.435-17.947c50.094-16.558 60.61-38.028 60.61-53.122V71.069c-.001-15.094-10.517-36.563-60.611-53.121M132.991 40.417C165.674 29.614 209.358 23.665 256 23.665s90.326 5.949 123.008 16.752c32.751 10.825 44.371 23.278 44.371 30.653s-11.62 19.827-44.371 30.653C346.326 112.525 302.64 118.474 256 118.474s-90.326-5.949-123.009-16.752C100.24 90.897 88.62 78.444 88.62 71.069s11.62-19.827 44.371-30.652m290.391 365.659c-4.347-.973-9.06.55-11.96 4.309-3.99 5.175-3.03 12.605 2.145 16.596 4.477 3.451 9.815 8.675 9.815 13.95-.002 7.373-11.623 19.826-44.373 30.651-32.684 10.804-76.369 16.753-123.009 16.753s-90.326-5.949-123.008-16.752c-32.75-10.825-44.371-23.278-44.371-30.653 0-5.275 5.338-10.498 9.815-13.95 5.175-3.991 6.135-11.421 2.145-16.596-2.9-3.759-7.613-5.282-11.96-4.309V107.103c8.885 5.953 20.867 11.773 36.945 17.087 35.015 11.574 81.339 17.948 130.435 17.948s95.42-6.374 130.435-17.948c16.078-5.314 28.06-11.134 36.945-17.087z"/>
    </svg>
`;

const icon_map = {
    "orange": orange_icon,
    "lemon": lemon_icon,
    "apple": apple_icon,
    "cube": cube_icon,
    "cylinder": cylinder_icon
};