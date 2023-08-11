import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMassage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharList();
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList: charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateCharList = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    renderItems = (arr) => {
        const items = arr.map(item => {
            let imgStyle = { 'objectFit': 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'contain' };
            }
            return (
                <li
                    className="char__item"
                    key={item.id}
                    onClick={() => { this.props.onCharSelected(item.id) }}>
                    <img src={item.thumbnail} alt="abyss" style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {
        const { charList, loading, error, } = this.state;
        const items = this.renderItems(charList);

        return (
            <div className="char__list">
                {error ? <ErrorMessage /> : loading ? <Spinner /> : items}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;