interface MyProps {
    name: string
}

const Header = ({name}: MyProps): JSX.Element => {
    return <h1>{name}</h1>
}

export default Header