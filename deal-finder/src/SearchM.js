import _ from 'lodash'
import faker from 'faker'
import React, { Component } from 'react'
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import source from './source';

// const source = [
//   {
//     "title": "NBA Live 18",
//     "description": "XBOX One",
//     "image": "https://images-na.ssl-images-amazon.com/images/I/61THT8eC26L._SL150_.jpg",
//     "price": "$55.62"
//   },
//   {
//     "title": "BOSE QC 35",
//     "description": "Bose headphones",
//     "image": "https://images-na.ssl-images-amazon.com/images/I/51VjLdXPp-L._AA320_FMwebp_QL65_.jpg",
//     "price": "$123.58"
//   },
//   {
//     "title": "Iphone X",
//     "description": "64 GB IPhone X",
//     "image": "https://multimedia.bbycastatic.ca/multimedia/products/500x500/115/11537/11537398.jpg",
//     "price": "$62.29"
//   },
//   {
//     "title": "Samsung SSD",
//     "category": "computers",
//     "link": "http://bestbuy.com/ssd",
//     "description": "500GB Samsung Solid State Drive",
//     "image": "https://multimedia.bbycastatic.ca/multimedia/products/150x150/123/12370/12370881.jpg",
//     "price": "$35.32"
//   },
// ]

export default class SearchM extends Component {
  favs = [];
  favs = JSON.parse(localStorage.getItem("favs"));

  componentWillMount() {
    this.resetComponent()
  }

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ 
      open: true,
    });
  };

  handleVisit = () => {
    window.open(this.state.visitURL,'_blank');
    this.setState({ open: false });
  };

  setFav = () => {
    this.favs.push(this.state.item);
    console.log(this.state);
    localStorage.setItem("favs", JSON.stringify(this.favs));
    alert(this.state.value);
  };

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, { result }) => {
    this.setState({ item: result, value: result.title, visitURL: result.link });
    this.handleClickOpen(result);
  }
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Grid>
         <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.value}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You can either purchase this item or save it to your favorites for later.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.setFav} color="primary">
              Favorite
            </Button>
            <Button onClick={this.handleVisit} color="primary" autoFocus>
              Visit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
            results={results}
            value={value}
            {...this.props}
          />
        </Grid.Column>
        {/* <Grid.Column width={10}>
          <Segment>
            <Header>State</Header>
            <pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state, null, 2)}</pre>
            <Header>Options</Header>
            <pre style={{ overflowX: 'auto' }}>{JSON.stringify(source, null, 2)}</pre>
          </Segment>
        </Grid.Column> */}
      </Grid>
    )
  }
}