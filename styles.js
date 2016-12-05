var { StyleSheet } = require('react-native');

module.exports = StyleSheet.create({
  indicator: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
  },
  defaultIndicator: {
    color: '#000000',
    fontSize: 50,
  },
  defaultInactiveIndicator: {
    color: '#999999',
    fontSize: 50,
  },
  defaultArrow: {
    color: '#000000',
    fontSize: 30,
    textAlign: 'center',
  },
  leftArrow: {
    position: 'absolute',
    left: 0
  },
  rightArrow: {
    position: 'absolute',
    right: 0
  },
  disabledArrow: {
    opacity: 0.2,
  }
});
