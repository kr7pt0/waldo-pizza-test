import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fp from 'lodash/fp';

class CartBody extends Component {
  static propTypes = {
    pizza: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      current: {
        size: null,
        toppings: []
       },
      list: []
    }
  }

  componentDidMount() {
    this.disposePizzaSelect('small')
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevState.current.size !== this.state.current.size) {
      this.defaultToppingCheckbox.checked = true
    }
  }

  setToppingRef = toppingName => element => {
    if (this.defaultSelectedToppingName === toppingName && element) {
      this.defaultToppingCheckbox = element
    }
  }

  disposePizzaSelect = size => {
    this.defaultSelectedToppingName = fp.compose(
      fp.get('topping.name'),
      fp.find('defaultSelected'),
      fp.get('toppings'),
      fp.find({ 'name': size })
    )(this.props.pizza)

    this.setState({
      current: {
        size,
        toppings: [ this.defaultSelectedToppingName ]
      }
    })
  }

  handlePizzaSelect = e => this.disposePizzaSelect(e.target.value)

  handleToppingSelect = e => {
    this.setState({
      current: {
        ...this.state.current,
        toppings: fp.xor([e.target.value])(this.state.current.toppings)
      }
    })
  }

  handleCartItemSelect = e => this.selectedCartItem = e.target.value

  handleRemoveClick = () => {
    this.setState({
      list: this.state.list.filter((val, key) => key != this.selectedCartItem)
  })}

  handleAddClick = () => {
    const size = this.state.current.size
    const price = this.price
    this.setState({
      list: [...this.state.list, {size, price}]
    })
  }

  render() {
    const { pizza } = this.props
    const pizzaDetail = fp.find({ 'name': this.state.current.size || 'small' })(pizza)
    const totalPrice = Math.round(fp.sumBy('price')(this.state.list) * 100) / 100
    const { toppings } = this.state.current
    const { maxToppings } = pizzaDetail
    const troppingPrice = fp.sumBy('topping.price')(pizzaDetail.toppings.filter(({ topping }) => toppings.includes(topping.name)))
    this.price = Math.round((pizzaDetail.basePrice + troppingPrice) * 100) / 100

    return (
      <div className='row' style={{marginTop: '10em'}}>
        <div className='col'>
          <div className="form-group">
            <label htmlFor="select-pizza">Select pizza</label>
            <select size={1} id="select-pizza" className="form-control" onChange={this.handlePizzaSelect}>
              <option value='small'>Small</option>
              <option value='medium'>Medium</option>
              <option value='large'>Large</option>
            </select>
          </div>
          <p>Price: {this.price}</p>
          <p>Max Toppings: {maxToppings || 'Unlimited'}</p>
          {
            pizzaDetail.toppings.map(({ topping }, i) => {
                const disabled = maxToppings ? toppings.length < maxToppings ? false : fp.indexOf(topping.name)(toppings) < 0 : false
                return (
                  <div key={pizzaDetail.name + i}>
                    <input
                      type='checkbox'
                      className="form-check-input"
                      value={topping.name}
                      ref={this.setToppingRef(topping.name)}
                      id={'topping-' + i}
                      disabled={disabled}
                      onClick={this.handleToppingSelect}
                    />
                    <label htmlFor={'topping-' + i}>{topping.name + ', ' + topping.price}</label>
                  </div>
                )
              }
            )
          }
          <button className="btn btn-primary" onClick={this.handleAddClick}>Add</button>
        </div>
        <div className='col'>
          <p>Added</p>
          <p>Total Price: {totalPrice}</p>
          <button className="btn btn-primary" onClick={this.handleRemoveClick}>Remove</button>
          <select className="form-control" size={20}>
          {this.state.list.map((pizza, key) => 
            <option
              key={key}
              value={key}
              onClick={this.handleCartItemSelect}
            >
              {pizza.size + ', ' + pizza.price}
            </option>
          )}
          </select>
        </div>
      </div>
    );
  }
}

export default CartBody;
