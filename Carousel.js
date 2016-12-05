'use strict';

var React = require('react');
var {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');

var TimerMixin = require('react-timer-mixin');
var CarouselPager = require('./CarouselPager');

var styles = require('./styles');

var Carousel = React.createClass({
  mixins: [TimerMixin],

  getDefaultProps() {
    return {
      animate: true,
      delay: 1000,
      loop: true,
      initialPage: 0,
      hideIndicators: false,
      indicatorAtBottom: true,
      indicatorOffset: 250,
      indicatorSpace: 25,
      indicatorStyle: styles.defaultIndicator,
      inactiveIndicatorStyle: styles.defaultInactiveIndicator,
      indicatorText: '•',
      inactiveIndicatorText: '•',
      arrowsAtBottom: false,
      arrowsVerticalOffset: 50,
      arrowsHorizontalOffset: 0,
      arrowStyle: styles.defaultArrow,
      leftArrow: '〈',
      rightArrow: '〉',
      width: null,
    };
  },

  getInitialState() {
    return {
      activePage: this.props.initialPage > 0 ? this.props.initialPage : 0,
    };
  },

  getWidth() {
    if (this.props.width !== null) {
      return this.props.width;
    } else {
      return Dimensions.get('window').width;
    }
  },

  componentDidMount() {
    if (this.props.initialPage > 0) {
      this.refs.pager.scrollToPage(this.props.initialPage, false);
    }

    if (this.props.animate && this.props.children){
      this._setUpTimer();
    }
  },

  scrollTo(activePage) {
    this.setState({activePage});
    this.refs.pager.scrollToPage(activePage);
  },

  wrapArrow(arrow) {
    if (typeof arrow === 'string') {
      return <Text style={[styles.defaultArrow, this.props.arrowStyle]}>{arrow} </Text>;
    } else {
      return arrow;
    }
  },

  renderPageIndicator() {
    if ((this.props.hideIndicators === true) || (this.props.children.length < 2)) {
      return null;
    }

    var indicators = [],
      indicatorStyle = this.props.indicatorAtBottom ? { bottom: this.props.indicatorOffset } : { top: this.props.indicatorOffset },
      style, position;

    position = { width: this.props.children.length * this.props.indicatorSpace, };
    position.left = (this.getWidth() - position.width) / 2;

    for (var i = 0, l = this.props.children.length; i < l; i++) {
      if (typeof this.props.children[i] === "undefined") {
        continue;
      }

      style = i === this.state.activePage
        ? this.props.indicatorStyle
        : this.props.inactiveIndicatorStyle;
      indicators.push(
        <Text
          style={style}
          key={i}
          onPress={this.scrollTo.bind(this,i)}
          >
          { i === this.state.activePage ? this.props.indicatorText : this.props.inactiveIndicatorText }
        </Text>
      );
    }

    if (indicators.length === 1) {
      return null;
    }

    return (
      <View style={[styles.indicator, position, indicatorStyle]}>
        {indicators}
      </View>
    );
  },

  renderLeftArrow() {
    if (this.props.children.length < 2) return null;

    var {
      leftArrow,
      arrowsAtBottom,
      arrowsVerticalOffset,
      arrowsHorizontalOffset,
      children,
      loop
    } = this.props;

    var { activePage } = this.state;

    var prev = activePage - 1;

    var onPress, isDisabled;

    if (prev >= 0) {
      isDisabled = false;
      onPress = () => this.scrollTo(prev);
    } else {
      isDisabled = true;
      onPress = null;
    }

    var arrowsVerticalStyle = arrowsAtBottom ? { bottom: arrowsVerticalOffset } :  { top: arrowsVerticalOffset };
    var arrowHorizontalStyle = { left: arrowsHorizontalOffset };

    return (
      <View style={[styles.leftArrow, arrowsVerticalStyle, arrowHorizontalStyle, (isDisabled ? styles.disabledArrow : {})]}>
        <TouchableOpacity onPress={onPress} disabled={isDisabled}>
          {this.wrapArrow(leftArrow)}
        </TouchableOpacity>
      </View>
    );
  },

  renderRightArrow() {
    if (this.props.children.length < 2) return null;
    var {
      rightArrow,
      arrowsAtBottom,
      arrowsVerticalOffset,
      arrowsHorizontalOffset,
      children,
      loop
    } = this.props;

    var { activePage } = this.state;

    var next = activePage + 1;

    var onPress, isDisabled;

    if (next < children.length) {
      isDisabled = false;
      onPress = () => this.scrollTo(next);
    } else {
      isDisabled = true;
      onPress = null;
    }

    var arrowsVerticalStyle = arrowsAtBottom ? { bottom: arrowsVerticalOffset } :  { top: arrowsVerticalOffset };
    var arrowHorizontalStyle = { right: arrowsHorizontalOffset };

    return (
      <View style={[styles.rightArrow, arrowsVerticalStyle, arrowHorizontalStyle, (isDisabled ? styles.disabledArrow : {})]}>
        <TouchableOpacity onPress={onPress} disabled={isDisabled}>
          {this.wrapArrow(rightArrow)}
        </TouchableOpacity>
      </View>
    );
  },

  _setUpTimer() {
    if (this.props.children.length > 1) {
      this.clearTimeout(this.timer);
      this.timer = this.setTimeout(this._animateNextPage, this.props.delay);
    }
  },

  _animateNextPage() {
    var activePage = 0;
    if (this.state.activePage < this.props.children.length - 1) {
      activePage = this.state.activePage + 1;
    } else if (!this.props.loop) {
      return;
    }

    this.scrollTo(activePage);
    this._setUpTimer();
  },

  _onAnimationBegin() {
    this.clearTimeout(this.timer);
    if (this.props.onBeginPageChange) {
      this.props.onBeginPageChange();
    }
  },

  _onAnimationEnd(activePage) {
    this.setState({activePage});
    if (this.props.onPageChange) {
      this.props.onPageChange(activePage);
    }
  },

  render() {
    return (
      <View style={{ flex: 1 }}>
        <CarouselPager
          ref="pager"
          width={this.getWidth()}
          contentContainerStyle={styles.container}
          onBegin={this._onAnimationBegin}
          onEnd={this._onAnimationEnd}
        >
          {this.props.children}
        </CarouselPager>
        {this.renderPageIndicator()}
        {this.renderLeftArrow()}
        {this.renderRightArrow()}
      </View>
    );
  },

});

module.exports = Carousel;
