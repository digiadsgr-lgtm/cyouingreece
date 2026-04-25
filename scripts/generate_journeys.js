"use strict";
/**
 * generate_journeys.ts
 * Generates 6 highly curated, premium itineraries and saves them to Sanity CMS.
 * Run with: npx tsc scripts/generate_journeys.ts --esModuleInterop --skipLibCheck --moduleResolution node && node scripts/generate_journeys.js
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
var JOURNEYS = [
    {
        title: "The Cycladic Off-Grid",
        duration_days: 7,
        islands_count: 3,
        image: "https://images.unsplash.com/photo-1601581975053-7680f7f9e01b?q=80&w=1200&auto=format&fit=crop",
        summary: "Discover the untamed beauty of Sikinos, Folegandros, and Kimolos. Leave the cruise ships behind and find true Aegean solitude.",
        itinerary: [
            { day: 1, location: "Sikinos", description: "Arrive via ferry and hike up to the ancient Temple of Episkopi. Dinner at a small taverna serving caper stew." },
            { day: 2, location: "Sikinos", description: "Private boat tour to untouched coves. Wine tasting at the local micro-winery suspended over the Aegean." },
            { day: 3, location: "Folegandros", description: "Morning ferry transfer. Settle into the Chora and walk the zigzag path to the Church of Panagia at sunset." },
            { day: 4, location: "Folegandros", description: "Hike to Katergo beach (no road access). Evening spent dining on traditional matsata pasta." },
            { day: 5, location: "Kimolos", description: "Transfer to the chalky island of Kimolos. Explore the fishing village of Goupa with its 'sirmata' boat houses." },
            { day: 6, location: "Kimolos", description: "Take a traditional kaiki boat to the uninhabited island of Polyaigos for swimming in neon blue waters." },
            { day: 7, location: "Athens", description: "Ferry back to Piraeus. End of the off-grid journey." },
        ]
    },
    {
        title: "The Ionian Deep Blue",
        duration_days: 10,
        islands_count: 2,
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop",
        summary: "Sail through the lush green mountains and crystal waters of Paxos, Antipaxos, and the hidden coves of Epirus.",
        itinerary: [
            { day: 1, location: "Paxos", description: "Arrive in Gaios. Charter a small boat to navigate the eastern coastline." },
            { day: 2, location: "Paxos", description: "Hike through ancient olive groves to the Erimitis cliffs for a sunset uninterrupted by crowds." },
            { day: 3, location: "Antipaxos", description: "Day trip to Antipaxos. Swim at Voutoumi and eat fresh fish straight from the grill on the beach." },
            { day: 4, location: "Paxos", description: "Explore the northern village of Lakka. Dine in the courtyard of a 19th-century olive press." },
            { day: 5, location: "Syvota (Mainland)", description: "Ferry to the mainland. Settle into a villa overlooking the Ionian archipelago." },
            { day: 6, location: "Syvota", description: "Private sailing around the uninhabited islands of Syvota. Dinner at a cliffside restaurant." },
            { day: 7, location: "Parga", description: "Drive down the coast to the colorful town of Parga. Climb the Venetian castle." },
            { day: 8, location: "Acheron River", description: "Wade through the freezing, crystal clear waters of the mythical River Acheron in the Epirus mountains." },
            { day: 9, location: "Parga", description: "A quiet day on the hidden beach of Sarakiniko (the Ionian one, not Milos)." },
            { day: 10, location: "Preveza/Athens", description: "Departure from Preveza airport or drive back to Athens." },
        ]
    },
    {
        title: "The Dodecanese Edge",
        duration_days: 8,
        islands_count: 4,
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
        summary: "A journey to the edge of the Aegean. From the sponge divers of Kalymnos to the silent volcanic crater of Nisyros.",
        itinerary: [
            { day: 1, location: "Kos", description: "Arrive in Kos. Quick transfer to avoid the crowds, heading straight for the mountains." },
            { day: 2, location: "Nisyros", description: "Ferry to Nisyros. Walk inside the active Stefanos volcanic crater. It feels like another planet." },
            { day: 3, location: "Nisyros", description: "Explore the village of Emporios and eat pork with local spices in the volcanic caldera." },
            { day: 4, location: "Tilos", description: "Ferry to the eco-island of Tilos. Hike to the abandoned village of Mikro Chorio, illuminated at night." },
            { day: 5, location: "Tilos", description: "Visit the dwarf elephant museum and swim at the secluded Eristos beach." },
            { day: 6, location: "Kalymnos", description: "Ferry to the island of sponge divers and rock climbers. Watch the sunset from the Grande Grotta." },
            { day: 7, location: "Telendos", description: "A five-minute boat ride to the car-free island of Telendos for absolute silence and fresh sea urchin." },
            { day: 8, location: "Kos/Athens", description: "Return ferry and flight home." },
        ]
    },
    {
        title: "The Peloponnese Grand Tour",
        duration_days: 12,
        islands_count: 0,
        image: "https://images.unsplash.com/photo-1515516089376-88db1e26e980?q=80&w=1200&auto=format&fit=crop",
        summary: "Drive through the wild heart of Greece. Castles, ancient ruins, and the rugged, unforgiving beauty of the Mani peninsula.",
        itinerary: [
            { day: 1, location: "Nafplio", description: "Arrive in the first capital of modern Greece. Walk the romantic Venetian streets." },
            { day: 2, location: "Epidaurus", description: "Visit the ancient theatre of Epidaurus at dawn to experience its perfect acoustics." },
            { day: 3, location: "Monemvasia", description: "Drive south to the 'Gibraltar of the East'. Sleep inside the medieval castle fortress." },
            { day: 4, location: "Monemvasia", description: "Hike to the upper town and taste local Malvasia wine." },
            { day: 5, location: "Mani Peninsula", description: "Enter the Deep Mani. Stay in a restored stone tower in Areopoli or Vatheia." },
            { day: 6, location: "Mani Peninsula", description: "Swim at the pebble beaches of Gerolimenas and eat roasted piglet." },
            { day: 7, location: "Mani Peninsula", description: "Hike to Cape Matapan, the southernmost point of mainland Europe and the mythical entrance to Hades." },
            { day: 8, location: "Messinia", description: "Drive up the west coast to the olive groves of Messinia." },
            { day: 9, location: "Voidokilia", description: "Visit the perfect semi-circle beach of Voidokilia and hike up to Nestor's Cave." },
            { day: 10, location: "Ancient Olympia", description: "Stand on the original starting line of the Olympic Games." },
            { day: 11, location: "Arcadia Mountains", description: "Drive into the misty mountains of Arcadia. Stay in the stone village of Dimitsana." },
            { day: 12, location: "Athens", description: "Return drive to Athens." },
        ]
    },
    {
        title: "The Cretan South",
        duration_days: 9,
        islands_count: 1,
        image: "https://images.unsplash.com/photo-1476837579993-f1d3948f17c2?q=80&w=1200&auto=format&fit=crop",
        summary: "Cross the White Mountains to reach the Libyan Sea. The wildest, most authentic, and fiercely independent side of Crete.",
        itinerary: [
            { day: 1, location: "Chania", description: "Arrive in Chania. Skip the harbor and eat where the locals eat in the Nea Chora district." },
            { day: 2, location: "Omalos", description: "Drive up into the White Mountains. Stay in a mountain lodge and eat antikristo lamb." },
            { day: 3, location: "Samaria/Agia Roumeli", description: "Hike the Samaria Gorge. Emerge at the car-free coastal village of Agia Roumeli." },
            { day: 4, location: "Loutro", description: "Take the ferry (or hike the coastal path) to Loutro, a village reachable only by boat." },
            { day: 5, location: "Sfakia", description: "Ferry to Chora Sfakion, the stronghold of Cretan resistance. Try the local Sfakian pie with honey." },
            { day: 6, location: "Plakias", description: "Drive the winding coastal road to Plakias. Swim at the Preveli palm forest beach." },
            { day: 7, location: "Triopetra", description: "Relax at the massive sand dunes of Triopetra beach. Dinner at a cliffside taverna." },
            { day: 8, location: "Rethymno Mountains", description: "Drive inland to the Amari valley. Visit ancient monasteries hidden in the hills." },
            { day: 9, location: "Heraklion/Chania", description: "Return to the north coast for departure." },
        ]
    },
    {
        title: "The Northern Frontier",
        duration_days: 8,
        islands_count: 0,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
        summary: "Mist-covered mountains, deep gorges, and stone villages. The Alpine side of Greece that few international tourists ever see.",
        itinerary: [
            { day: 1, location: "Thessaloniki", description: "Arrive in Greece's culinary capital. Spend the evening exploring the Ano Poli and eating street food." },
            { day: 2, location: "Meteora", description: "Drive south to the floating monasteries of Meteora. Hike the ancient monk trails at sunset." },
            { day: 3, location: "Metsovo", description: "Drive the mountain pass to Metsovo. Taste the famous smoked cheese and bold red wines." },
            { day: 4, location: "Zagori", description: "Enter the Zagorohoria—a network of 46 stone villages. Stay in Papigo or Monodendri." },
            { day: 5, location: "Vikos Gorge", description: "Hike a section of the Vikos Gorge, the deepest gorge in the world relative to its width." },
            { day: 6, location: "Voidomatis River", description: "Rafting in the freezing, crystal clear waters of the Voidomatis river." },
            { day: 7, location: "Ioannina", description: "Visit the lakeside city of Ioannina. Take the boat to the island in the lake for frog legs and baklava." },
            { day: 8, location: "Thessaloniki", description: "Return drive via the Egnatia Odos highway for departure." },
        ]
    }
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
function generateJourney(journey) {
    return __awaiter(this, void 0, void 0, function () {
        var imageAssetId, slug, doc, existing, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDDFA Generating Journey: ".concat(journey.title));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, uploadImageToSanity(journey.image, "".concat(journey.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40), "-hero.jpg"))];
                case 2:
                    imageAssetId = _a.sent();
                    slug = journey.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    doc = {
                        _type: 'journey',
                        title: journey.title,
                        slug: { _type: 'slug', current: slug },
                        duration_days: journey.duration_days,
                        islands_count: journey.islands_count,
                        summary: journey.summary,
                        itinerary: journey.itinerary.map(function (day) { return ({
                            _key: Math.random().toString(),
                            day: day.day,
                            location: day.location,
                            description: day.description
                        }); }),
                        hero_image: imageAssetId
                            ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } }
                            : undefined,
                    };
                    return [4 /*yield*/, sanityClient.fetch("*[_type == \"journey\" && slug.current == $slug][0]._id", { slug: slug })];
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
                    console.log("\u2705 Published: ".concat(journey.title));
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("\u274C Failed: ".concat(journey.title), error_1);
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
                    console.log("\uD83D\uDE80 Generating ".concat(JOURNEYS.length, " curated journeys locally..."));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < JOURNEYS.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, generateJourney(JOURNEYS[i])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('🎉 All journeys generated!');
                    return [2 /*return*/];
            }
        });
    });
}
run();
