module.exports = function timeConverter(javascript_timestamp) {
  return Math.round(javascript_timestamp.getTime() / 1000);
};
