import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMassage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charsEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharList();
    }

    onRequest(offset) {
        this.onChatListLoading()
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onChatListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charsEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateCharList = () => {
        this.marvelService.getAllCharacters()
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnitem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    renderItems = (arr) => {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };

            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'contain' };
            }
            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    key={item.id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.focusOnitem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(item.id);
                            this.focusOnitem(i);
                        }
                    }}>
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
        const { charList, loading, error, offset, newItemLoading, charsEnded } = this.state;
        const items = this.renderItems(charList);

        return (
            <div className="char__list">
                {error ? <ErrorMessage /> : loading ? <Spinner /> : items}
                <button className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{ 'display': charsEnded ? 'hide' : 'block' }}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;