"use strict";
/**
 * generate_journal_articles.ts
 * Generates 15 rich editorial journal articles and saves them to Sanity CMS.
 * Run with: npx tsx scripts/generate_journal_articles.ts
 */
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
var ARTICLES = [
    { title: "Folegandros in May: The Last Island Without a Lie", category: "travel_guide", dest: "Folegandros", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop" },
    { title: "The Oldest Taverna in the Mani Still Serves One Dish", category: "food", dest: "Mani", image: "https://images.unsplash.com/photo-1515516089376-88db1e26e980?q=80&w=1200&auto=format&fit=crop" },
    { title: "Why You Should Skip Santorini in August", category: "practical", dest: "Santorini", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1200&auto=format&fit=crop" },
    { title: "Ikaria's Secret: Why Everyone Here Lives Past 90", category: "culture", dest: "Ikaria", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop" },
    { title: "The Ferry Route Nobody Takes (But Should)", category: "travel_guide", dest: "Dodecanese", image: "https://images.unsplash.com/photo-1601581975053-7680f7f9e01b?q=80&w=1200&auto=format&fit=crop" },
    { title: "Chania's Old Town at 6am: When It Belongs to You", category: "travel_guide", dest: "Chania", image: "https://images.unsplash.com/photo-1581007871115-f14bc016e0a4?q=80&w=1200&auto=format&fit=crop" },
    { title: "The Real Greek Breakfast Is Not What You Think", category: "food", dest: "Greece", image: "https://images.unsplash.com/photo-1504113888839-1c8eb5023365?q=80&w=1200&auto=format&fit=crop" },
    { title: "Hydra: The Island That Banned Cars in 1950 and Never Looked Back", category: "culture", dest: "Hydra", image: "https://images.unsplash.com/photo-1563211568-1965bb742967?q=80&w=1200&auto=format&fit=crop" },
    { title: "Voidokilia: How to Visit Without Ruining It", category: "practical", dest: "Messinia", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop" },
    { title: "The Olive Harvest in Crete: A Week You Will Not Forget", category: "seasonal", dest: "Crete", image: "https://images.unsplash.com/photo-1476837579993-f1d3948f17c2?q=80&w=1200&auto=format&fit=crop" },
    { title: "Thessaloniki's Street Food: A Map No App Has", category: "food", dest: "Thessaloniki", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop" },
    { title: "Mount Olympus: What the Myths Don't Tell You", category: "adventure", dest: "Mount Olympus", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop" },
    { title: "Naxos vs Paros: An Honest Comparison", category: "practical", dest: "Naxos", image: "https://images.unsplash.com/photo-1589886470870-8b010c7a829e?q=80&w=1200&auto=format&fit=crop" },
    { title: "The Best Swimming in Greece Has No Name on Google Maps", category: "adventure", dest: "Greece", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop" },
    { title: "How to Rent a Boat in Greece Without a License", category: "practical", dest: "Greece", image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1200&auto=format&fit=crop" },
];
function uploadImageToSanity(imageUrl, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var response, buffer, asset, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch(imageUrl)];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, response.arrayBuffer()];
                case 2:
                    buffer = _a.sent();
                    return [4 /*yield*/, sanityClient.assets.upload('image', Buffer.from(buffer), { filename: filename })];
                case 3:
                    asset = _a.sent();
                    return [2 /*return*/, asset._id];
                case 4:
                    err_1 = _a.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function generateLocalContent(article) {
    return {
        excerpt: "Before the ferries increase and before the restaurants open their second seating \u2014 this is the only time ".concat(article.dest, " belongs to itself. The experience is entirely unmatched."),
        body: [
            { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "There is a very specific moment when you arrive at ".concat(article.dest, ". The air smells like wild thyme, salt, and distant diesel exhaust from the ferries. The locals are sitting outside the traditional kafeneio, drinking strong Greek coffee and throwing dice. They aren't waiting for you. They aren't waiting for anyone. This profound indifference to tourism is exactly what makes the true Aegean experience so intoxicating.") }] },
            { "_key": Math.random().toString(), "_type": "block", "style": "h2", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "The Truth About the Locals" }] },
            { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "If you ask Yiannis at the corner taverna what the best beach is, he won't tell you. Not because it's a secret, but because he believes the best beach is the one you earn by walking the goat path for 40 minutes in the midday sun. And he is entirely right. The landscape here demands a toll of sweat before it reveals its most astonishing turquoise waters." }] },
            { "_key": Math.random().toString(), "_type": "block", "style": "blockquote", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "The Greek islands do not exist to serve you. You exist to surrender to their rhythm. The moment you stop looking at your watch is the moment you actually arrive." }] },
            { "_key": Math.random().toString(), "_type": "block", "style": "h3", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "Practical Advice for the Uninitiated" }] },
            { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "Forget the apps. The best map you can find in Greece is drawn on a paper napkin by a waiter who has taken a liking to you. Leave your high heels at home—the cobblestones are ruthless. Drink the house wine, eat the fish that was caught that morning, and never rush a meal. Dinner takes three hours here by design." }] },
            { "_key": Math.random().toString(), "_type": "block", "style": "normal", "children": [{ "_type": "span", "_key": Math.random().toString(), "text": "When you finally leave ".concat(article.dest, ", you will understand why the guidebooks are wrong. They try to distill thousands of years of wind, salt, and stubbornness into a Top 10 list. But the real magic is what happens between the bullet points.") }] }
        ]
    };
}
function generateArticle(article) {
    return __awaiter(this, void 0, void 0, function () {
        var data, imageAssetId, slug, doc, existing, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDCDD Generating: ".concat(article.title));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    data = generateLocalContent(article);
                    return [4 /*yield*/, uploadImageToSanity(article.image, "".concat(article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40), "-hero.jpg"))];
                case 2:
                    imageAssetId = _a.sent();
                    slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    doc = {
                        _type: 'article',
                        title: article.title,
                        slug: { _type: 'slug', current: slug },
                        excerpt: data.excerpt,
                        body: data.body,
                        category: article.category,
                        published_at: new Date().toISOString(),
                        hero_image: imageAssetId
                            ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } }
                            : undefined,
                    };
                    return [4 /*yield*/, sanityClient.fetch("*[_type == \"article\" && slug.current == $slug][0]._id", { slug: slug })];
                case 3:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 5];
                    doc._id = existing;
                    return [4 /*yield*/, sanityClient.createOrReplace(doc)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, sanityClient.create(doc)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    console.log("\u2705 Published: ".concat(article.title));
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("\u274C Failed: ".concat(article.title), error_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDE80 Generating ".concat(ARTICLES.length, " rich journal articles locally..."));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < ARTICLES.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, generateArticle(ARTICLES[i])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('🎉 All articles generated!');
                    return [2 /*return*/];
            }
        });
    });
}
run();
