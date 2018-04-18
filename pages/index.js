import React from 'react'

import knex from '../utils/database'

export default class extends React.Component {
  static async getInitialProps({ req }) {
    const data = await knex.select().from('category-images')
    return { data }
  }

  uploadImage = (title, image) => {
    const payload = { title, image }

    return fetch('/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function(response) {
      return response.blob();
    })
  }

  onChange = (title) => (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    
    reader.onloadend = () => {
      this.uploadImage(title, reader.result)
        .then(res => location.reload())
    }

    reader.readAsDataURL(file);
  }

  renderImage(image) {
    if (image) return <img src={image} />
    return '–'
  }

  renderTable() {
    return this.props.data.map((item, index) => (
      <tr key={index}>
        <td>{ item.category }</td>
        <td>{ this.renderImage(item.image) }</td>
        <td><input type="file" onChange={this.onChange(item.category)} /></td>
      </tr>
    ))
  }

  render() {
    return (
      <table>
        <tbody>
          { this.renderTable() }
        </tbody>
      </table>
    )
  }
}