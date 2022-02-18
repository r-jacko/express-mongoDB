const express = require("express");
const router = express.Router();
const News = require("../models/news");

/* GET home page. */
router.get("/", (req, res) => {
  // aktualnie wyszukiwana wartość
  const search = req.query.search || "";

  // pierwszy art find to obiekt do zawężania wyszukiwania, używamy regexp aby wyszukwiać tylko część frazy, np. art pozwoli wszykać wszystkie tytułu które zawierają w sobie część "art", nowa reguła, pierwszy parametr to ciąg znaków jaki przeszukujemy, drugi to forma pod jaką będziemy szukali. możemy na search wykonać funkcję .trim() aby obcinać wszystkie spacje. Ale wyrzuci błąd jeżeli search nie istnieje i zwraca undefined, więc zabezpieczamy się przed tym przy deklaracji search
  const findNews = News.find({ title: new RegExp(search.trim(), "i") }).sort({
    created: -1,
  }); //aby posortować dane rosnąco dajemy +1, malejąco -1, 0 zostawia sortowanie domyślne
  findNews.exec((err, data) => {
    // console.log(data);
    res.render("news", { title: "News", data, search });
  });
});

module.exports = router;
