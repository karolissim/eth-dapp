import react, { Component } from 'react'

class Sell extends Component {
    render() {
        return (
            <div id="content" className="forms sell-form">
                <h1 className="form-intro sell-text">Sell your item for free</h1>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const title = this.title.value
                    const desc = this.description.value
                    const photo = this.photo.value
                    const price = window.web3.utils.toWei(this.price.value.toString(), 'Ether')
                    console.log(title + " " + desc + " " + photo + " " + price)
                    this.props.createItem(title, desc, photo, price)
                }}>
                    <div className="form-group sell-form-text">
                        <input
                            id="title"
                            className="form-control"
                            type="text"
                            ref={(input) => { this.title = input }}
                            className="form-control"
                            placeholder="Title"
                            required />
                    </div>
                    <div className="form-group sell-form-text">
                        <input
                            id="description"
                            className="form-control"
                            type="textarea"
                            ref={(input) => { this.description = input }}
                            className="form-control"
                            placeholder="Description"
                            required />
                    </div>
                    <div className="form-group sell-form-text">
                        <input
                            id="photo"
                            className="form-control"
                            type="text"
                            ref={(input) => { this.photo = input }}
                            className="form-control"
                            placeholder="Photo url"
                            required />
                    </div>
                    <div className="form-group sell-form-text">
                        <input
                            id="price"
                            className="form-control"
                            type="textarea"
                            ref={(input) => { this.price = input }}
                            className="form-control"
                            placeholder="Item's price"
                            required />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary form-submit form-button">Add item to shop 💰</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Sell