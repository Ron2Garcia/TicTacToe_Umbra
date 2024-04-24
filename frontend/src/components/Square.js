const Square = ({ value, onSlotClick }) => {
    return (
        <div onClick={onSlotClick}>{value}</div>
    )
}

export default Square