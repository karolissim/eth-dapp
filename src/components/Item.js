import React from 'react'
import '../App.css'

const Item = (props) => {
    return (
        <div className="col item">
            <div className="item-container">
                <div className="img-container">
                    <img className="item-img" src={props.item.photoUrl} alt=""></img>
                </div>
                <div className="item-info">
                    <h2 className="item-name">{props.item.name}</h2>
                    <p className='item-desc'>{props.item.description}</p>
                    <h2 className="item-price">{props.item.price} ETH</h2>
                    {props.item.isAvailable
                        ? <div className="text-center">
                            <button
                                className="btn btn-primary form-submit form-button"
                                type="submit"
                                name={props.item.id}
                                onClick={(event) => {
                                    console.log(event.target.name)
                                    props.buyItem(event.target.name)
                                }}>BUY ITEM</button>
                        </div>
                        : <p>Item already sold</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Item