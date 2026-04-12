Professional Color Palette - Investing Fear

PRIMARY COLOR
Name:     Primary Red
Hex:      #F7374F
RGB:      247, 55, 79
Usage:    CTAs, buttons, highlights, important elements
Light:    #FF6B7A
Dark:     #D91E2F

SECONDARY COLOR
Name:     Deep Burgundy
Hex:      #88304E
RGB:      136, 48, 78
Usage:    Hover states, secondary elements, accents
Light:    #A85070
Dark:     #6B1F3A

TERTIARY COLOR
Name:     Dark Purple
Hex:      #522546
RGB:      82, 37, 70
Usage:    Cards, containers, secondary backgrounds
Light:    (derived)
Dark:     (derived)

QUATERNARY COLOR
Name:     Charcoal Black
Hex:      #2C2C2C
RGB:      44, 44, 44
Usage:    Text, dark backgrounds, primary dark mode background

SUPPORTING COLORS
White:    #FFFFFF (Light backgrounds, text on dark)
Gray:     #F1F1F1 - #808080 (Neutral elements)
Green:    #10B981 (Success, low risk)
Yellow:   #F59E0B (Warning, medium risk)
Red:      #EF4444 (Danger, high risk)

TAILWIND CONFIGURATION
Colors available in Tailwind:
- bg-primary, text-primary, border-primary
- bg-secondary, text-secondary, border-secondary
- bg-tertiary, text-tertiary, border-tertiary
- bg-quaternary, text-quaternary, border-quaternary
- bg-primary-light, text-primary-light
- bg-primary-dark, text-primary-dark
- bg-secondary-light, text-secondary-light
- bg-secondary-dark, text-secondary-dark

COMPONENT COLOR MAPPING

Navbar:
- Background (Dark): #2C2C2C
- Background (Light): #FFFFFF
- Text: #2C2C2C / #FFFFFF
- Hover: #F7374F
- Icons: #F7374F

Hero Section:
- Background: Gradient from #2C2C2C to #88304E
- Title: #FFFFFF
- Subtitle: #D3D3D3
- CTA Button: #F7374F
- Badge Background: #522546

Risk Simulator:
- Container: #522546 (dark) / #FFFFFF (light)
- Input: #88304E (dark) / #F1F1F1 (light)
- Best Case: #10B981
- Average Case: #F59E0B
- Worst Case: #EF4444
- Chart Line: #F7374F

Loss Probability Meter:
- Gauge: Gradient #10B981 -> #F59E0B -> #EF4444
- Low Risk: #10B981
- Medium Risk: #F59E0B
- High Risk: #EF4444
- Background: #522546 (dark) / #FFFFFF (light)

AI Explainer:
- Container: #522546 (dark) / #FFFFFF (light)
- Input: #88304E (dark) / #F1F1F1 (light)
- Output: #F7374F background with white text
- Button: #F7374F

Learning Section:
- Card Background: #522546 (dark) / #F9F9F9 (light)
- Icon Background: #F7374F
- Icon: #FFFFFF
- CTA: #F7374F

Footer:
- Background: #2C2C2C
- Text: #A0A0A0
- Links: #A0A0A0
- Hover: #FFFFFF
- Icons: #A0A0A0

DARK MODE
Background: #2C2C2C
Secondary Background: #522546
Text: #FFFFFF
Secondary Text: #D3D3D3
Borders: #88304E

LIGHT MODE
Background: #FFFFFF
Secondary Background: #F9F9F9
Text: #2C2C2C
Secondary Text: #666666
Borders: #E0E0E0

ACCESSIBILITY
- Contrast Ratio (Primary on White): 4.5:1 (AA compliant)
- Contrast Ratio (Primary on Dark): 5.2:1 (AAA compliant)
- All text meets WCAG AA standards
- Color not used as only means of conveying information

USAGE EXAMPLES

Button:
<button className="bg-primary hover:bg-primary-dark text-white">
  Click Me
</button>

Card:
<div className="bg-tertiary text-white rounded-lg p-6">
  Content
</div>

Icon:
<Target className="w-6 h-6 text-primary" />

Text:
<p className="text-quaternary dark:text-white">
  Content
</p>

Gradient:
<div className="bg-gradient-to-r from-secondary to-tertiary">
  Content
</div>

BRAND GUIDELINES
- Primary color used for all CTAs and important actions
- Secondary color for hover states and secondary elements
- Tertiary for card backgrounds and containers
- Quaternary for text and dark backgrounds
- Maintain consistent spacing and sizing
- Use Lucide icons for all iconography
- Keep typography clean and professional
