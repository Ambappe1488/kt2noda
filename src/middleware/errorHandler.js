module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE' || err.message.includes('Недопустимый тип файла')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: 'Внутренняя ошибка сервера'
  });
};
