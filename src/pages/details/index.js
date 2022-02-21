import {Lightning, Router} from "@lightningjs/sdk";
import {MovieInfo, Rating, Title} from "../../components";
import Logo from "./Logo";

export default class Details extends Lightning.Component {

    static _template() {
        return {
            Item: {
                flex: {direction: "column"},
                x: 90,
                mountY: 0.5, y: 514,
                transitions: {
                    alpha: {duration: 0.3, delay: 0.1, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                    mountY: {duration: 0.3, delay: 0.1, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                    y: {duration: 0.3, delay: 0.1, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                    x: {duration: 0.6, delay: 0.4, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
                },
                Title: {
                    type: Title,
                    skip: true
                },
                Details: {
                    flex: {},
                    flexItem: {marginTop: -20},
                    Rating: {
                        type: Rating
                    },
                    MovieInfo: {
                        flexItem: {marginLeft: 20},
                        type: MovieInfo
                    }
                },
                Holder: {
                    flexItem: {marginTop: 40},
                    alpha: 0, mountY: 0.5,
                    transitions: {
                        alpha: {duration: 0.6, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                        y: {duration: 0.6, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
                    },
                    Overview: {
                        text: {fontFace: "Regular", fontSize: 24, lineHeight: 44, textColor: 0xffc3c3c3, wordWrapWidth: 1000}
                    }
                }
            },
            LogosHolder: {
                flexItem: false,
                y: 120,
                Logos: {
                    mountX: 1, x: 1830
                }
            }
        };
    };

    _init() {
        this.tag("Item").transition("y").on("finish", ()=> {
            this.tag("Holder").y = 30;
            this.tag("Holder").patch({
                smooth: {
                    alpha: 1, y: 0
                }
            });

            this.tag("Logos").children.forEach(logo => {
                logo.setSmooth("x", 0);
                logo.setSmooth("alpha", 1);
            });
        });
    }

    _active() {
        this.application.emit("contentHeight", 0);

        this.patch({
            Item: {
                smooth: {y: 110, x: 110, mountY: 0}
            }
        });

        this.widgets.detailsmenu.select("details", true);
    }

    _inactive() {
        this.patch({
            Item: {
                smooth: {y: 514, x: 90, mountY: 0.5}
            }
        });
    }

    set content(v) {
        this._item = v;

        this.tag("Title").label = this._item.title;
        this.tag("MovieInfo").info = {date: this._item.formattedReleaseDate, genres: this._item.genresAsString};
        this.tag("Overview").text = this._item.overview;
        this.tag("Rating").voteAverage = this._item.voteAverage;
        this.tag("Rating").startAnimation(true);

        let logoIndex = 0;
        this._item.productionCompanies.forEach(company => {
            if (company.logo_path !== null && logoIndex < 6) {
                this.tag("Logos").childList.a(this.stage.c({
                    type: Logo, logo: company.logo_path, y: logoIndex * 140,
                    x: 30, alpha: 0.001,
                    transitions: {
                        alpha: {duration: 0.6, delay: 0.15 * logoIndex, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'},
                        x: {duration: 0.6, delay: 0.15 * logoIndex, timingFunction: 'cubic-bezier(0.20, 1.00, 0.80, 1.00)'}
                    }
                }));
                logoIndex++;
            }
        });

        this.application.emit("setItem", {item: this._item});
    }

    set detailsType(v) {
        this._detailsType = v;
    }

    _handleDown() {
        this.widgets.detailsmenu.select("cast");
        Router.navigate(`cast/${this._detailsType}/${this._item.id}`, true);
    }
}