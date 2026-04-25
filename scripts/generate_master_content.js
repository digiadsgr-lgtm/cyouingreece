"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var client_1 = require("@sanity/client");
var sanityClient = (0, client_1.createClient)({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sntl6fxn',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-04-18',
});
var DESTINATIONS = [
    "Santorini", "Mykonos", "Naxos", "Paros", "Milos", "Chania", "Heraklion", "Rethymno",
    "Rhodes", "Kos", "Patmos", "Symi", "Corfu", "Paxos", "Zakynthos", "Kefalonia", "Lefkada",
    "Ithaca", "Skiathos", "Skopelos", "Alonissos", "Skyros", "Thassos", "Samothrace", "Lemnos",
    "Lesvos", "Chios", "Samos", "Ikaria", "Syros", "Tinos", "Andros", "Sifnos", "Serifos",
    "Folegandros", "Amorgos", "Astypalaia", "Karpathos", "Kythira", "Aegina", "Hydra", "Spetses",
    "Poros", "Athens", "Thessaloniki", "Nafplio", "Delphi", "Meteora", "Zagori", "Mani", "Monemvasia", "Olympus"
];
var THEMES = [
    { category: 'Culture', keywords: ['culture', 'history', 'tradition', 'architecture'] },
    { category: 'Churches', keywords: ['church', 'monastery', 'religion', 'orthodox', 'chapel'] },
    { category: 'Museums', keywords: ['museum', 'archaeological', 'exhibition', 'ancient'] },
    { category: 'Gastronomy', keywords: ['cuisine', 'food', 'wine', 'gastronomy', 'restaurant', 'taverna'] },
    { category: 'Entertainment', keywords: ['nightlife', 'festival', 'entertainment', 'club'] }
];
function getWikipediaData(query) {
    return __awaiter(this, void 0, void 0, function () {
        var searchUrl, searchRes, searchData, title, url, res, data, pages, firstPage, e_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=".concat(encodeURIComponent(query + ' Greece'), "&utf8=&format=json");
                    return [4 /*yield*/, fetch(searchUrl)];
                case 1:
                    searchRes = _c.sent();
                    return [4 /*yield*/, searchRes.json()];
                case 2:
                    searchData = _c.sent();
                    title = ((_a = searchData.query.search[0]) === null || _a === void 0 ? void 0 : _a.title) || query;
                    url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&explaintext=true&format=json&piprop=original&titles=".concat(encodeURIComponent(title));
                    return [4 /*yield*/, fetch(url)];
                case 3:
                    res = _c.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _c.sent();
                    pages = data.query.pages;
                    firstPage = Object.values(pages)[0];
                    return [2 /*return*/, {
                            extract: (firstPage === null || firstPage === void 0 ? void 0 : firstPage.extract) || "".concat(query, " is a beautiful destination in Greece."),
                            imageUrl: ((_b = firstPage === null || firstPage === void 0 ? void 0 : firstPage.original) === null || _b === void 0 ? void 0 : _b.source) || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'
                        }];
                case 5:
                    e_1 = _c.sent();
                    return [2 /*return*/, {
                            extract: "".concat(query, " is a beautiful destination in Greece."),
                            imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop'
                        }];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getWikimediaImageForTheme(dest, theme) {
    return __awaiter(this, void 0, void 0, function () {
        var searchUrl, searchRes, searchData, title, url, res, data, pages, firstPage, e_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=".concat(encodeURIComponent(dest + ' ' + theme + ' Greece'), "&utf8=&format=json");
                    return [4 /*yield*/, fetch(searchUrl)];
                case 1:
                    searchRes = _b.sent();
                    return [4 /*yield*/, searchRes.json()];
                case 2:
                    searchData = _b.sent();
                    if (!searchData.query.search.length)
                        return [2 /*return*/, null];
                    title = searchData.query.search[0].title;
                    url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=".concat(encodeURIComponent(title));
                    return [4 /*yield*/, fetch(url)];
                case 3:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _b.sent();
                    pages = data.query.pages;
                    firstPage = Object.values(pages)[0];
                    return [2 /*return*/, ((_a = firstPage === null || firstPage === void 0 ? void 0 : firstPage.original) === null || _a === void 0 ? void 0 : _a.source) || null];
                case 5:
                    e_2 = _b.sent();
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function uploadImageToSanity(imageUrl, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var response, buffer, asset, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!imageUrl)
                        return [2 /*return*/, null];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch(imageUrl)];
                case 2:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error('Failed to fetch image');
                    return [4 /*yield*/, response.arrayBuffer()];
                case 3:
                    buffer = _a.sent();
                    return [4 /*yield*/, sanityClient.assets.upload('image', Buffer.from(buffer), { filename: filename })];
                case 4:
                    asset = _a.sent();
                    return [2 /*return*/, asset._id];
                case 5:
                    err_1 = _a.sent();
                    return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function extractRelevantParagraphs(text, keywords) {
    var paragraphs = text.split('\n').filter(function (p) { return p.length > 50; });
    var relevant = paragraphs.filter(function (p) { return keywords.some(function (k) { return p.toLowerCase().includes(k); }); });
    if (relevant.length === 0)
        return "Explore the rich local heritage and uncover hidden secrets of this amazing destination.";
    return relevant.slice(0, 3).join('\n\n');
}
function processMasterDestination(dest) {
    return __awaiter(this, void 0, void 0, function () {
        var wikiData, heroAssetId, thematic_sections, _i, THEMES_1, theme, contentText, themeImageUrl, themeAssetId, typeMapping, firstSentence, doc, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Building Master Profile for ".concat(dest, "..."));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    return [4 /*yield*/, getWikipediaData(dest)];
                case 2:
                    wikiData = _a.sent();
                    return [4 /*yield*/, uploadImageToSanity(wikiData.imageUrl, "".concat(dest.toLowerCase(), "-hero.jpg"))];
                case 3:
                    heroAssetId = _a.sent();
                    thematic_sections = [];
                    _i = 0, THEMES_1 = THEMES;
                    _a.label = 4;
                case 4:
                    if (!(_i < THEMES_1.length)) return [3 /*break*/, 8];
                    theme = THEMES_1[_i];
                    contentText = extractRelevantParagraphs(wikiData.extract, theme.keywords);
                    return [4 /*yield*/, getWikimediaImageForTheme(dest, theme.category)];
                case 5:
                    themeImageUrl = _a.sent();
                    return [4 /*yield*/, uploadImageToSanity(themeImageUrl, "".concat(dest.toLowerCase(), "-").concat(theme.category.toLowerCase(), ".jpg"))];
                case 6:
                    themeAssetId = _a.sent();
                    thematic_sections.push({
                        _key: Math.random().toString(),
                        _type: 'thematicSection',
                        category: theme.category,
                        title: "".concat(theme.category, " in ").concat(dest),
                        content: [
                            {
                                _key: Math.random().toString(),
                                _type: "block",
                                style: "normal",
                                children: [{ "_type": "span", "_key": Math.random().toString(), "text": contentText }]
                            }
                        ],
                        hero_image: themeAssetId ? {
                            _type: 'image',
                            asset: { _type: 'reference', _ref: themeAssetId }
                        } : undefined
                    });
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 4];
                case 8:
                    typeMapping = {
                        "Athens": "city", "Thessaloniki": "city", "Chania": "city", "Heraklion": "city", "Nafplio": "city",
                        "Delphi": "archaeological_site", "Meteora": "archaeological_site",
                        "Olympus": "mountain", "Zagori": "village", "Mani": "peninsula", "Monemvasia": "village"
                    };
                    firstSentence = wikiData.extract.split('. ')[0] + '.';
                    doc = {
                        _type: 'destination',
                        name_en: dest,
                        name_local: dest,
                        slug: { _type: 'slug', current: dest.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
                        type: typeMapping[dest] || 'island',
                        tagline: "Discover the authentic beauty of ".concat(dest, "."),
                        intro_paragraph: wikiData.extract.substring(0, 500) + '...',
                        body_content: [
                            {
                                _key: Math.random().toString(),
                                _type: "block",
                                style: "normal",
                                children: [{ "_type": "span", "_key": Math.random().toString(), "text": wikiData.extract.substring(0, 1000) }]
                            }
                        ],
                        thematic_sections: thematic_sections,
                        hidden_gems: [
                            { _key: "1", _type: "hiddenGem", title: "Local Trails", description: "Explore the ancient pathways." },
                            { _key: "2", _type: "hiddenGem", title: "Secret Cove", description: "A pristine spot away from the crowds." },
                            { _key: "3", _type: "hiddenGem", title: "Historic Ruin", description: "Unmarked history." }
                        ],
                        gastronomy: [
                            { _key: "1", _type: "gastronomyItem", dish_name: "Fresh Catch", where_to_find: "Harbor Taverna", description: "Grilled perfectly." },
                            { _key: "2", _type: "gastronomyItem", dish_name: "Local Cheese", where_to_find: "Village Market", description: "Artisan made." },
                            { _key: "3", _type: "gastronomyItem", dish_name: "Wild Greens", where_to_find: "Mountain Taverna", description: "Foraged daily." }
                        ],
                        top_experiences: [
                            { _key: "1", _type: "experience", title: "Sunset Hike", description: "Watch the sun dip below the Aegean." },
                            { _key: "2", _type: "experience", title: "Village Walk", description: "Discover the architecture." },
                            { _key: "3", _type: "experience", title: "Boat Tour", description: "See the coast from the water." }
                        ],
                        hero_image: heroAssetId ? {
                            _type: 'image',
                            asset: { _type: 'reference', _ref: heroAssetId }
                        } : undefined,
                        seo: {
                            meta_title: "Explore ".concat(dest, " | CYouInGreece"),
                            meta_description: firstSentence
                        },
                        review_status: 'ai_draft',
                        ai_generated: true,
                        editor_approved: false
                    };
                    return [4 /*yield*/, sanityClient.create(doc)];
                case 9:
                    _a.sent();
                    console.log("\u2705 Successfully published Master Profile for ".concat(dest));
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error("\u274C Failed to process ".concat(dest, ":"), error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, DESTINATIONS_1, dest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Starting Master Pipeline for ".concat(DESTINATIONS.length, " articles..."));
                    _i = 0, DESTINATIONS_1 = DESTINATIONS;
                    _a.label = 1;
                case 1:
                    if (!(_i < DESTINATIONS_1.length)) return [3 /*break*/, 5];
                    dest = DESTINATIONS_1[_i];
                    return [4 /*yield*/, processMasterDestination(dest)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 1000); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log('🎉 All destinations masterfully processed!');
                    return [2 /*return*/];
            }
        });
    });
}
run();
