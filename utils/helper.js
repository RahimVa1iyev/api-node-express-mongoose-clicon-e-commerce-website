const calculatePercent = (price , percent) => {
  return  Math.ceil(price - ((price * percent) / 100))
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Baku' };
    return date.toLocaleString('az-AZ', options);
}

module.exports = {calculatePercent ,formatDate}