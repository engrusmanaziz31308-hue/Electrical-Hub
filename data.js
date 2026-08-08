// ============ Static data ============

// Appliance load list — common Pakistani household items
const APPLIANCES = [
  { key:"led_bulb",  en:"LED Bulb",              ur:"ایل ای ڈی بلب",        watt:10,  hrs:6  },
  { key:"tube_led",  en:"LED Tube Light",         ur:"ایل ای ڈی ٹیوب لائٹ",  watt:20,  hrs:6  },
  { key:"fan_ceiling", en:"Ceiling Fan",          ur:"سیلنگ فین",            watt:75,  hrs:10 },
  { key:"fan_pedestal", en:"Pedestal / Table Fan", ur:"پیڈسٹل / ٹیبل فین",   watt:60,  hrs:6  },
  { key:"fridge_med", en:"Refrigerator (medium)", ur:"فریج (درمیانہ)",       watt:150, hrs:24 },
  { key:"freezer",   en:"Deep Freezer",           ur:"ڈیپ فریزر",            watt:200, hrs:24 },
  { key:"led_tv",    en:"LED TV (32–43\")",       ur:"ایل ای ڈی ٹی وی",      watt:100, hrs:5  },
  { key:"washing",   en:"Washing Machine",        ur:"واشنگ مشین",           watt:500, hrs:1  },
  { key:"iron",      en:"Electric Iron",          ur:"استری",                watt:1000, hrs:0.5 },
  { key:"microwave", en:"Microwave Oven",         ur:"مائیکروویو اوون",       watt:1200, hrs:0.5 },
  { key:"motor",     en:"Water Motor / Pump",     ur:"واٹر موٹر / پمپ",      watt:750, hrs:1  },
  { key:"cooler",    en:"Air Cooler",             ur:"ایئر کولر",            watt:200, hrs:8  },
  { key:"ac_1_5",    en:"Split AC – 1.5 Ton (inverter)", ur:"اسپلٹ اے سی – 1.5 ٹن (انورٹر)", watt:1200, hrs:6 },
  { key:"laptop",    en:"Laptop",                 ur:"لیپ ٹاپ",              watt:65,  hrs:5  },
  { key:"pc",        en:"Desktop Computer",       ur:"ڈیسک ٹاپ کمپیوٹر",     watt:200, hrs:5  },
  { key:"router",    en:"Wi-Fi Router",           ur:"وائی فائی راؤٹر",       watt:10,  hrs:24 },
  { key:"dispenser", en:"Water Dispenser",        ur:"واٹر ڈسپنسر",          watt:100, hrs:24 },
  { key:"blender",   en:"Mixer / Blender",        ur:"مکسر / بلینڈر",        watt:400, hrs:0.3 },
  { key:"geyser",    en:"Electric Geyser (heavy — avoid on solar if possible)", ur:"الیکٹرک گیزر (بھاری لوڈ — سولر پر گریز بہتر ہے)", watt:2000, hrs:1 },
  { key:"mobile_charger", en:"Mobile Charger", ur:"موبائل چارجر", watt:10, hrs:3 },
];

// Wire & breaker sizing chart (general reference, copper, PVC insulated)
// "imperial" = the local/bazaar notation used across Pakistan (strands / strand-diameter in inches,
// e.g. "3/.029" spoken as "three twenty-nine", "7/.029" as "seven twenty-nine"). These are the
// classic imperial cable sizes and their nearest modern mm² equivalent, matched to BS 6004 / IEE tables.
const WIRE_CHART = [
  { size:"1.0",  swg:"18",  rating:"11",  breaker:"10 A",     imperial:"1/.044",  use_en:"Lighting circuits, small points", use_ur:"لائٹنگ سرکٹ، چھوٹے پوائنٹس" },
  { size:"1.5",  swg:"17",  rating:"15",  breaker:"15 / 16 A", imperial:"3/.029",  use_en:"General lighting & fan points", use_ur:"عام لائٹنگ اور پنکھے کے پوائنٹس" },
  { size:"2.5",  swg:"14",  rating:"21",  breaker:"20 A",     imperial:"7/.029",  use_en:"Socket outlets, general power points", use_ur:"ساکٹ اور عام پاور پوائنٹس" },
  { size:"4",    swg:"12",  rating:"28",  breaker:"25 / 32 A", imperial:"7/.036",  use_en:"Kitchen circuits, water motor", use_ur:"کچن سرکٹ، واٹر موٹر" },
  { size:"6",    swg:"10",  rating:"36",  breaker:"32 / 40 A", imperial:"7/.044",  use_en:"AC (1–1.5 Ton), heavy appliances", use_ur:"اے سی (1–1.5 ٹن)، بھاری آلات" },
  { size:"10",   swg:"8",   rating:"50",  breaker:"40 / 50 A", imperial:"7/.052",  use_en:"Sub-main wiring, 2 Ton AC", use_ur:"سب مین وائرنگ، 2 ٹن اے سی" },
  { size:"16",   swg:"6",   rating:"66",  breaker:"63 A",     imperial:"7/.064",  use_en:"Distribution board feeders", use_ur:"ڈسٹری بیوشن بورڈ فیڈر" },
  { size:"25",   swg:"4",   rating:"88",  breaker:"80 A",     imperial:"19/.052", use_en:"Main incoming supply (small home)", use_ur:"مین سپلائی (چھوٹا گھر)" },
  { size:"35",   swg:"2",   rating:"110", breaker:"100 A",    imperial:"19/.064", use_en:"Main incoming supply (larger home)", use_ur:"مین سپلائی (بڑا گھر)" },
];

// Breaker (MCB) sizing chart — standard ratings and typical circuit use
const BREAKER_CHART = [
  { amp:"6",   wire:"1.0 mm²", curve:"B / C", use_en:"Very small lighting circuit (few points only)", use_ur:"بہت چھوٹا لائٹنگ سرکٹ (چند پوائنٹس)" },
  { amp:"10",  wire:"1.0 – 1.5 mm²", curve:"B / C", use_en:"Lighting circuit main breaker", use_ur:"لائٹنگ سرکٹ کا مین بریکر" },
  { amp:"16",  wire:"1.5 mm²", curve:"B / C", use_en:"General lighting & fan sub-circuit", use_ur:"عام لائٹنگ اور پنکھے کا سب سرکٹ" },
  { amp:"20",  wire:"2.5 mm²", curve:"C", use_en:"Socket outlets / general power points", use_ur:"ساکٹ اور عام پاور پوائنٹس" },
  { amp:"25",  wire:"4 mm²", curve:"C", use_en:"Kitchen circuit, water motor / pump", use_ur:"کچن سرکٹ، واٹر موٹر / پمپ" },
  { amp:"32",  wire:"6 mm²", curve:"C / D", use_en:"Split AC (1 – 1.5 Ton) dedicated circuit", use_ur:"اسپلٹ اے سی (1 – 1.5 ٹن) کا مخصوص سرکٹ" },
  { amp:"40",  wire:"6 – 10 mm²", curve:"C / D", use_en:"AC (1.5 – 2 Ton) / small sub-main", use_ur:"اے سی (1.5 – 2 ٹن) / چھوٹا سب مین" },
  { amp:"50",  wire:"10 mm²", curve:"C / D", use_en:"2 Ton AC / sub-distribution board feed", use_ur:"2 ٹن اے سی / سب ڈسٹری بیوشن بورڈ فیڈ" },
  { amp:"63",  wire:"16 mm²", curve:"C / D", use_en:"Distribution board feeder breaker", use_ur:"ڈسٹری بیوشن بورڈ فیڈر بریکر" },
  { amp:"80",  wire:"25 mm²", curve:"C / D", use_en:"Main incoming supply — small home", use_ur:"مین سپلائی — چھوٹا گھر" },
  { amp:"100", wire:"35 mm²", curve:"C / D", use_en:"Main incoming supply — larger home", use_ur:"مین سپلائی — بڑا گھر" },
  { amp:"125", wire:"50 mm²", curve:"C / D", use_en:"Main switch — commercial / heavy load feed", use_ur:"مین سوئچ — کمرشل / بھاری لوڈ فیڈ" },
];

// Standard breaker ratings used for auto-sizing (Amps)
const STD_BREAKER_SIZES = [6,10,16,20,25,32,40,50,63,80,100,125,160,200];

// Length unit conversion (base unit = metre)
const LENGTH_UNITS = [
  { key:"mm", en:"Millimetre (mm)", ur:"ملی میٹر (mm)", toM:0.001 },
  { key:"cm", en:"Centimetre (cm)", ur:"سینٹی میٹر (cm)", toM:0.01 },
  { key:"m",  en:"Metre (m)",       ur:"میٹر (m)",       toM:1 },
  { key:"km", en:"Kilometre (km)",  ur:"کلومیٹر (km)",   toM:1000 },
  { key:"in", en:"Inch (in)",       ur:"انچ (in)",       toM:0.0254 },
  { key:"ft", en:"Foot (ft)",       ur:"فٹ (ft)",        toM:0.3048 },
  { key:"yd", en:"Yard (yd)",       ur:"گز (yd)",        toM:0.9144 },
];

// Power unit conversion (base unit = Watt)
const POWER_UNITS = [
  { key:"w",  en:"Watt (W)",         ur:"واٹ (W)",       toW:1 },
  { key:"kw", en:"Kilowatt (kW)",    ur:"کلو واٹ (kW)",  toW:1000 },
  { key:"hp", en:"Horsepower (hp)",  ur:"ہارس پاور (hp)", toW:745.7 },
  { key:"va", en:"Volt-Amp (VA)",    ur:"وولٹ ایمپیئر (VA)", toW:1 },
];

// Energy unit conversion (base unit = Wh)
const ENERGY_UNITS = [
  { key:"wh",  en:"Watt-hour (Wh)",   ur:"واٹ آور (Wh)",   toWh:1 },
  { key:"kwh", en:"Kilowatt-hour (kWh / Unit)", ur:"کلو واٹ آور (kWh / یونٹ)", toWh:1000 },
  { key:"j",   en:"Joule (J)",        ur:"جول (J)",        toWh:1/3600 },
  { key:"kj",  en:"Kilojoule (kJ)",   ur:"کلو جول (kJ)",   toWh:1000/3600 },
];

// Wire size conversion — mm² (metric) to nearest AWG (American Wire Gauge)
const WIRE_MM2_AWG = [
  { mm2:0.5,  awg:"20" }, { mm2:0.75, awg:"18" }, { mm2:1.0,  awg:"17" },
  { mm2:1.5,  awg:"15" }, { mm2:2.5,  awg:"13" }, { mm2:4,    awg:"11" },
  { mm2:6,    awg:"9" },  { mm2:10,   awg:"7" },  { mm2:16,   awg:"5" },
  { mm2:25,   awg:"3" },  { mm2:35,   awg:"2" },  { mm2:50,   awg:"0 (1/0)" },
  { mm2:70,   awg:"00 (2/0)" }, { mm2:95, awg:"000 (3/0)" }, { mm2:120, awg:"0000 (4/0)" },
];

// Glossary terms — each may include an optional formula (mono, language-neutral)
// and an optional extra explanatory detail line (detail_en / detail_ur).
const GLOSSARY = [
  { en:"Voltage", ur:"وولٹیج", def_en:"The electrical pressure that pushes current through a circuit, measured in Volts (V).", def_ur:"وہ برقی دباؤ جو کرنٹ کو سرکٹ میں دھکیلتا ہے، اسے وولٹ (V) میں ناپا جاتا ہے۔", formula:"V = I × R", detail_en:"Household mains voltage in Pakistan is 230V (single phase) or 400V (three phase, line-to-line).", detail_ur:"پاکستان میں گھریلو مین وولٹیج 230V (سنگل فیز) یا 400V (تھری فیز، لائن ٹو لائن) ہوتی ہے۔" },
  { en:"Current", ur:"کرنٹ", def_en:"The rate of flow of electric charge through a conductor, measured in Amperes (A).", def_ur:"کسی موصل میں برقی چارج کے بہاؤ کی رفتار، اسے ایمپیئر (A) میں ناپا جاتا ہے۔", formula:"I = V ÷ R  or  I = P ÷ V", detail_en:"Wire and breaker sizes are always chosen based on the maximum current a circuit will carry.", detail_ur:"وائر اور بریکر کا سائز ہمیشہ سرکٹ کے زیادہ سے زیادہ کرنٹ کے حساب سے منتخب کیا جاتا ہے۔" },
  { en:"Resistance", ur:"مزاحمت", def_en:"Opposition offered by a material to the flow of current, measured in Ohms (Ω).", def_ur:"کسی مادے کی طرف سے کرنٹ کے بہاؤ کے خلاف مزاحمت، اسے اوہم (Ω) میں ناپا جاتا ہے۔", formula:"R = V ÷ I", detail_en:"Longer, thinner wires have more resistance; thicker, shorter wires have less.", detail_ur:"لمبی اور پتلی تار میں مزاحمت زیادہ ہوتی ہے؛ موٹی اور چھوٹی تار میں کم۔" },
  { en:"Power (Watt)", ur:"پاور (واٹ)", def_en:"The rate at which electrical energy is used or produced, measured in Watts (W). Power = Voltage × Current.", def_ur:"جس رفتار سے بجلی کی توانائی استعمال یا پیدا ہوتی ہے، اسے واٹ (W) میں ناپا جاتا ہے۔ پاور = وولٹیج × کرنٹ۔", formula:"P = V × I", detail_en:"This is the number printed on appliance labels — used directly by the Load Calculator to size your system.", detail_ur:"یہی وہ نمبر ہے جو آلات کے لیبل پر لکھا ہوتا ہے — لوڈ کیلکولیٹر میں براہ راست اسی سے سسٹم کا سائز طے ہوتا ہے۔" },
  { en:"Energy (kWh / Unit)", ur:"توانائی (kWh / یونٹ)", def_en:"Power used over time. 1 unit on your electricity bill equals 1 kilowatt-hour (1000W running for 1 hour).", def_ur:"وقت کے ساتھ استعمال ہونے والی پاور۔ بجلی کے بل پر 1 یونٹ = 1 کلو واٹ آور (1000 واٹ ایک گھنٹے چلنا)۔", formula:"E (Wh) = P (W) × t (h)", detail_en:"Add up every appliance's Wh/day to get your total daily energy need for solar sizing.", detail_ur:"سولر سائزنگ کے لیے ہر آلے کا Wh/دن جمع کر کے کل روزانہ توانائی کی ضرورت معلوم ہوتی ہے۔" },
  { en:"Ohm's Law", ur:"اوہم کا قانون", def_en:"The basic relationship between voltage, current and resistance: V = I × R.", def_ur:"وولٹیج، کرنٹ اور مزاحمت کا بنیادی تعلق: V = I × R۔", formula:"V = I × R", detail_en:"From this single formula you can always find the third value if you know any two.", detail_ur:"اس ایک فارمولے سے، اگر کوئی دو قدریں معلوم ہوں تو تیسری ہمیشہ نکالی جا سکتی ہے۔" },
  { en:"Frequency", ur:"فریکوئنسی", def_en:"How many times AC current changes direction per second, measured in Hertz (Hz). Pakistan's grid runs at 50 Hz.", def_ur:"AC کرنٹ فی سیکنڈ کتنی بار سمت بدلتا ہے، اسے ہرٹز (Hz) میں ناپا جاتا ہے۔ پاکستان کا گرڈ 50 Hz پر چلتا ہے۔" },
  { en:"AC (Alternating Current)", ur:"اے سی (متبادل کرنٹ)", def_en:"Electric current that periodically reverses direction — the type supplied by the power grid.", def_ur:"وہ برقی کرنٹ جو وقفے وقفے سے سمت بدلتا رہتا ہے — یہی قسم پاور گرڈ سے فراہم ہوتی ہے۔" },
  { en:"DC (Direct Current)", ur:"ڈی سی (براہ راست کرنٹ)", def_en:"Electric current that flows in one direction only — produced by batteries and solar panels.", def_ur:"وہ برقی کرنٹ جو صرف ایک ہی سمت میں بہتا ہے — بیٹری اور سولر پینل سے حاصل ہوتا ہے۔", detail_en:"An inverter converts this DC into usable AC for household appliances.", detail_ur:"انورٹر اسی DC کو گھریلو آلات کے لیے قابل استعمال AC میں بدلتا ہے۔" },
  { en:"Circuit Breaker / MCB", ur:"سرکٹ بریکر / ایم سی بی", def_en:"A safety switch that automatically cuts power when current exceeds a safe limit, protecting wiring from overheating.", def_ur:"ایک حفاظتی سوئچ جو کرنٹ کی محفوظ حد سے زیادہ ہونے پر خودبخود بجلی بند کر دیتا ہے، تاکہ تاریں زیادہ گرم ہو کر خراب نہ ہوں۔", detail_en:"Common curve types: B (lighting/resistive loads), C (motors, AC, general use), D (heavy inrush like large motors). See the Breaker Chart tab for standard sizes.", detail_ur:"عام کرو اقسام: B (لائٹنگ/عام لوڈ)، C (موٹرز، اے سی، عمومی استعمال)، D (بھاری اسٹارٹنگ کرنٹ، بڑی موٹرز)۔ معیاری سائز کے لیے بریکر چارٹ ٹیب دیکھیں۔" },
  { en:"ELCB / RCCB", ur:"ای ایل سی بی / آر سی سی بی", def_en:"A safety device that trips when it detects current leaking to earth, protecting people from electric shock.", def_ur:"ایک حفاظتی آلہ جو زمین کی طرف کرنٹ کا رساؤ محسوس ہونے پر بجلی بند کر دیتا ہے، تاکہ کرنٹ لگنے سے بچاؤ ہو۔" },
  { en:"Fuse", ur:"فیوز", def_en:"A thin wire that melts and breaks the circuit when current is too high, protecting the circuit from damage.", def_ur:"ایک پتلی تار جو کرنٹ زیادہ ہونے پر پگھل کر سرکٹ توڑ دیتی ہے، تاکہ سرکٹ محفوظ رہے۔" },
  { en:"Earthing / Grounding", ur:"ارتھنگ / گراؤنڈنگ", def_en:"A safety connection to the earth that gives excess current a safe path away from people and equipment.", def_ur:"زمین سے حفاظتی کنکشن جو زائد کرنٹ کو انسانوں اور آلات سے دور محفوظ راستہ فراہم کرتا ہے۔" },
  { en:"Short Circuit", ur:"شارٹ سرکٹ", def_en:"An unintended low-resistance connection that causes a sudden, dangerous surge of current.", def_ur:"ایک غیر ارادی کم مزاحمت کنکشن جو اچانک اور خطرناک کرنٹ کے اضافے کا باعث بنتا ہے۔" },
  { en:"Overload", ur:"اوورلوڈ", def_en:"Drawing more current through a circuit than it is rated to safely carry.", def_ur:"سرکٹ کی محفوظ گنجائش سے زیادہ کرنٹ کھینچنا۔" },
  { en:"Load", ur:"لوڈ", def_en:"Any device or appliance that consumes electrical power.", def_ur:"کوئی بھی آلہ جو بجلی کی طاقت استعمال کرتا ہے۔" },
  { en:"Single Phase", ur:"سنگل فیز", def_en:"A standard household electrical supply using one live wire and one neutral — typical for homes.", def_ur:"ایک عام گھریلو بجلی سپلائی جس میں ایک لائیو تار اور ایک نیوٹرل ہوتا ہے — عام طور پر گھروں میں۔" },
  { en:"Three Phase", ur:"تھری فیز", def_en:"A supply using three live wires, common for larger motors, industry and commercial buildings.", def_ur:"تین لائیو تاروں والی سپلائی، عام طور پر بڑی موٹرز، صنعت اور کمرشل عمارتوں میں استعمال ہوتی ہے۔", formula:"P = √3 × V × I × PF" },
  { en:"Neutral Wire", ur:"نیوٹرل تار", def_en:"The wire that completes the circuit back to the supply, normally carrying little or no voltage.", def_ur:"وہ تار جو سرکٹ کو واپس سپلائی تک مکمل کرتی ہے، عام طور پر اس میں بہت کم یا کوئی وولٹیج نہیں ہوتا۔" },
  { en:"Live / Phase Wire", ur:"لائیو / فیز تار", def_en:"The wire carrying voltage from the supply to the load — touching it causes electric shock.", def_ur:"وہ تار جو سپلائی سے لوڈ تک وولٹیج لے جاتی ہے — اسے چھونے سے کرنٹ لگ سکتا ہے۔" },
  { en:"Transformer", ur:"ٹرانسفارمر", def_en:"A device that raises or lowers AC voltage between two circuits using electromagnetic induction.", def_ur:"ایک آلہ جو برقی مقناطیسی انڈکشن کے ذریعے دو سرکٹس کے درمیان اے سی وولٹیج کم یا زیادہ کرتا ہے۔" },
  { en:"Inverter", ur:"انورٹر", def_en:"A device that converts DC power (from batteries/solar) into AC power that household appliances can use.", def_ur:"ایک آلہ جو DC پاور (بیٹری/سولر سے) کو AC پاور میں بدلتا ہے تاکہ گھریلو آلات چل سکیں۔", formula:"Inverter VA = (Load W × Surge factor) ÷ PF", detail_en:"Sized in the Solar Design tab using your peak load, a surge/starting factor and power factor.", detail_ur:"سولر ڈیزائن ٹیب میں پیک لوڈ، سرج/اسٹارٹنگ فیکٹر اور پاور فیکٹر کی بنیاد پر اس کا سائز طے ہوتا ہے۔" },
  { en:"UPS", ur:"یو پی ایس", def_en:"Uninterruptible Power Supply — a battery-backed device that instantly powers appliances during an outage.", def_ur:"بجلی جانے پر فوری طور پر بیٹری سے آلات چلانے والا آلہ۔" },
  { en:"Solar Panel", ur:"سولر پینل", def_en:"A device that converts sunlight directly into DC electricity using photovoltaic cells.", def_ur:"وہ آلہ جو سورج کی روشنی کو براہ راست فوٹو وولٹک سیلز کے ذریعے DC بجلی میں بدلتا ہے۔" },
  { en:"Wp (Watt-peak)", ur:"واٹ پیک (Wp)", def_en:"The maximum power a solar panel can produce under standard test conditions (full sun).", def_ur:"وہ زیادہ سے زیادہ پاور جو ایک سولر پینل معیاری حالات (پوری دھوپ) میں پیدا کر سکتا ہے۔", formula:"Array Wp = Daily Energy ÷ (Sun Hours × System Efficiency)", detail_en:"Real-world output is always lower than the Wp rating due to heat, dust, shading and cable losses.", detail_ur:"حرارت، گردوغبار، سایہ اور تاروں کے نقصان کی وجہ سے حقیقی پیداوار ہمیشہ Wp ریٹنگ سے کم ہوتی ہے۔" },
  { en:"Battery Capacity (Ah)", ur:"بیٹری گنجائش (Ah)", def_en:"Ampere-hours — how much current a battery can supply over time before it's depleted.", def_ur:"ایمپیئر آور — بیٹری کتنے وقت تک کتنا کرنٹ فراہم کر سکتی ہے جب تک وہ ختم نہ ہو جائے۔", formula:"Ah = (Daily Energy × Backup days) ÷ (Battery V × DOD × Efficiency)" },
  { en:"DOD (Depth of Discharge)", ur:"ڈی او ڈی (ڈسچارج کی گہرائی)", def_en:"The percentage of a battery's capacity that is safely used before recharging — deeper discharge shortens battery life.", def_ur:"بیٹری کی گنجائش کا وہ فیصد جو دوبارہ چارج کرنے سے پہلے محفوظ طریقے سے استعمال ہوتا ہے — زیادہ ڈسچارج بیٹری کی عمر کم کرتا ہے۔", detail_en:"Lead-acid batteries are typically limited to 50% DOD; lithium (LiFePO4) batteries can safely go to 80–90%.", detail_ur:"لیڈ ایسڈ بیٹری عام طور پر 50% DOD تک محدود ہوتی ہے؛ لیتھیم (LiFePO4) بیٹری 80–90% تک محفوظ طریقے سے جا سکتی ہے۔" },
  { en:"Charge Controller (MPPT/PWM)", ur:"چارج کنٹرولر (MPPT/PWM)", def_en:"A device that regulates the power from solar panels going into the battery, preventing overcharging.", def_ur:"ایک آلہ جو سولر پینل سے بیٹری میں جانے والی پاور کو کنٹرول کرتا ہے، تاکہ اووچارجنگ نہ ہو۔", detail_en:"MPPT controllers are more efficient (~95–98%) than older PWM controllers (~75–80%), especially with higher panel voltages.", detail_ur:"MPPT کنٹرولر پرانے PWM کنٹرولر (~75–80%) کے مقابلے میں زیادہ مؤثر (~95–98%) ہوتے ہیں، خاص طور پر زیادہ پینل وولٹیج پر۔" },
  { en:"Power Factor", ur:"پاور فیکٹر", def_en:"A ratio (0–1) showing how effectively electrical power is being used; lower values mean more wasted energy.", def_ur:"ایک تناسب (0–1) جو بتاتا ہے کہ بجلی کتنی مؤثر طریقے سے استعمال ہو رہی ہے؛ کم قدر کا مطلب زیادہ توانائی ضائع ہونا ہے۔", formula:"PF = Real Power (W) ÷ Apparent Power (VA)" },
  { en:"Voltage Drop", ur:"وولٹیج ڈراپ", def_en:"The reduction in voltage as current travels through a cable — too much drop weakens appliance performance.", def_ur:"جیسے جیسے کرنٹ کیبل میں سفر کرتا ہے وولٹیج میں کمی آتی ہے — زیادہ کمی آلات کی کارکردگی کمزور کر دیتی ہے۔", formula:"Vdrop = (2 × ρ × Length × I) ÷ Cable size (mm²)", detail_en:"Keep voltage drop under 3% for safe, efficient operation — use the Voltage Drop calculator to check your cable run.", detail_ur:"محفوظ اور مؤثر آپریشن کے لیے وولٹیج ڈراپ 3% سے کم رکھیں — اپنی کیبل چیک کرنے کے لیے وولٹیج ڈراپ کیلکولیٹر استعمال کریں۔" },
  { en:"kW / kVA", ur:"کلو واٹ / کے وی اے", def_en:"kW is real power used; kVA is apparent power (including reactive power) — inverter and generator sizes are usually rated in kVA.", def_ur:"kW حقیقی استعمال شدہ پاور ہے؛ kVA بظاہر پاور ہے (ری ایکٹو پاور سمیت) — انورٹر اور جنریٹر کا سائز عام طور پر kVA میں بتایا جاتا ہے۔", formula:"kW = kVA × Power Factor" },
  { en:"Series Circuit", ur:"سیریز سرکٹ", def_en:"A circuit where components are connected end-to-end so the same current flows through all of them.", def_ur:"ایک سرکٹ جس میں پرزے ایک دوسرے سے سرے سے سرے تک جڑے ہوتے ہیں، اور سب سے ایک ہی کرنٹ گزرتا ہے۔" },
  { en:"Parallel Circuit", ur:"پیرلل سرکٹ", def_en:"A circuit where components are connected across the same two points, so voltage is the same across all of them.", def_ur:"ایک سرکٹ جس میں پرزے ایک ہی دو پوائنٹس کے درمیان جڑے ہوتے ہیں، اور سب پر وولٹیج برابر رہتی ہے۔" },
  { en:"Insulation", ur:"انسولیشن", def_en:"Non-conductive material (like PVC) covering wires to prevent electric shock and short circuits.", def_ur:"غیر موصل مواد (جیسے PVC) جو تاروں کو ڈھانپ کر کرنٹ لگنے اور شارٹ سرکٹ سے بچاتا ہے۔" },
  { en:"Conductor", ur:"موصل", def_en:"A material, usually copper or aluminum, that allows electric current to flow easily through it.", def_ur:"ایک مادہ، عام طور پر تانبا یا ایلومینیم، جس میں سے کرنٹ آسانی سے گزر سکتا ہے۔" },
  { en:"kWh (Unit)", ur:"کلو واٹ آور (یونٹ)", def_en:"The standard unit of electricity billed by utility companies; equal to using 1000 Watts for 1 hour.", def_ur:"بجلی کی وہ معیاری اکائی جو بجلی کمپنیاں بل کرتی ہیں؛ 1000 واٹ کا ایک گھنٹہ استعمال ہونے کے برابر۔", formula:"kWh = (Watts × Hours) ÷ 1000" },
  { en:"Net Metering", ur:"نیٹ میٹرنگ", def_en:"A billing system where excess solar power sent back to the grid is credited against your electricity bill.", def_ur:"ایک بلنگ نظام جس میں گرڈ کو واپس بھیجی گئی اضافی سولر بجلی آپ کے بل میں منہا کی جاتی ہے۔" },
];
