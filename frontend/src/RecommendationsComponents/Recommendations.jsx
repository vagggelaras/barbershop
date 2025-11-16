import { useState, useRef } from 'react'
import { GoogleGenAI } from "@google/genai"
import "./Recommendations.css"

export default function Recommendations() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [recommendations, setRecommendations] = useState(null)
    const [faceShape, setFaceShape] = useState(null)
    const [gender, setGender] = useState(null) // 'male' or 'female'
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const imageRef = useRef(null)

    // Haircut recommendations based on face shape and gender
    const haircutsByFaceShape = {
        male: {
            oval: [
                {
                    name: "Classic Pompadour",
                    reason: "Oval faces are versatile and can pull off most styles. The pompadour adds height and volume that complements your balanced proportions.",
                    features: "Volume on top, shorter sides, swept back styling"
                },
                {
                    name: "Textured Crop",
                    reason: "This modern cut enhances your naturally balanced features without overwhelming them.",
                    features: "Short textured top, fade or tapered sides, natural movement"
                },
                {
                    name: "Side Part",
                    reason: "A timeless choice that works perfectly with oval face shapes, adding a touch of sophistication.",
                    features: "Clean side part, medium length on top, tapered sides"
                }
            ],
            round: [
                {
                    name: "High Fade with Quiff",
                    reason: "The height on top elongates your face while the high fade slims the sides, creating a more angular appearance.",
                    features: "High volume quiff, skin fade on sides, sharp lines"
                },
                {
                    name: "Spiky Textured Top",
                    reason: "Vertical spikes add height and create the illusion of a longer face shape.",
                    features: "Textured spikes, medium to high fade, angular styling"
                },
                {
                    name: "Faux Hawk",
                    reason: "This style draws the eye upward and adds vertical dimension to balance round features.",
                    features: "Central ridge of longer hair, faded sides, edgy look"
                }
            ],
            square: [
                {
                    name: "Buzz Cut",
                    reason: "Your strong jawline and angular features are perfectly complemented by this clean, masculine cut.",
                    features: "Uniform short length, low maintenance, highlights bone structure"
                },
                {
                    name: "Short Textured Crop",
                    reason: "Adds softness to angular features while maintaining a masculine edge.",
                    features: "Textured fringe, short sides, natural finish"
                },
                {
                    name: "Classic Taper",
                    reason: "A timeless cut that respects your strong features without competing with them.",
                    features: "Gradual length transition, clean neckline, versatile styling"
                }
            ],
            heart: [
                {
                    name: "Side Swept Fringe",
                    reason: "The fringe balances a wider forehead while the side sweep adds width at the jawline.",
                    features: "Longer fringe, swept to side, medium length overall"
                },
                {
                    name: "Medium Length Textured",
                    reason: "Adds fullness around the jawline, balancing the narrower chin with the wider forehead.",
                    features: "Layered cut, textured ends, medium length"
                },
                {
                    name: "Textured Fringe",
                    reason: "A textured fringe softens the forehead while adding interest to your overall look.",
                    features: "Choppy fringe, textured top, tapered sides"
                }
            ],
            oblong: [
                {
                    name: "Side Part with Volume",
                    reason: "Adds width to the sides of your face, balancing the longer face shape.",
                    features: "Side part, volume on sides, medium length"
                },
                {
                    name: "Fringe with Layers",
                    reason: "A fringe shortens the appearance of a long face while layers add horizontal dimension.",
                    features: "Full fringe, layered sides, medium to long length"
                },
                {
                    name: "Textured Crop with Fringe",
                    reason: "The fringe reduces forehead visibility while texture adds width.",
                    features: "Textured top, longer fringe, balanced proportions"
                }
            ],
            diamond: [
                {
                    name: "Textured Fringe",
                    reason: "Adds width to the forehead area, balancing your prominent cheekbones.",
                    features: "Textured fringe, volume on top, soft finish"
                },
                {
                    name: "Side Swept Style",
                    reason: "Creates the illusion of a wider forehead while softening angular cheekbones.",
                    features: "Side swept top, medium length, natural texture"
                },
                {
                    name: "Medium Length Layers",
                    reason: "Adds fullness around the chin area to balance the wider cheekbone area.",
                    features: "Layered cut, medium length, face-framing layers"
                }
            ]
        },
        female: {
            oval: [
                {
                    name: "Long Layers",
                    reason: "Your balanced proportions allow you to wear virtually any style. Long layers add movement and dimension.",
                    features: "Face-framing layers, versatile length, soft movement"
                },
                {
                    name: "Blunt Bob",
                    reason: "A classic bob highlights your symmetrical features and adds sophistication.",
                    features: "Clean lines, chin to shoulder length, sleek finish"
                },
                {
                    name: "Soft Waves",
                    reason: "Waves add romantic texture while complementing your naturally balanced face shape.",
                    features: "Medium to long length, loose waves, volume throughout"
                }
            ],
            round: [
                {
                    name: "Long Layered Cut",
                    reason: "Long layers elongate your face and create a slimming effect.",
                    features: "Layers starting below chin, face-framing pieces, length past shoulders"
                },
                {
                    name: "Side-Swept Bangs",
                    reason: "Diagonal lines from side-swept bangs create the illusion of a longer face.",
                    features: "Angled bangs, medium to long length, asymmetrical styling"
                },
                {
                    name: "Lob with Volume",
                    reason: "A long bob with volume at the crown adds height and balances round features.",
                    features: "Shoulder-length, layered crown, textured ends"
                }
            ],
            square: [
                {
                    name: "Soft Layered Waves",
                    reason: "Soft waves and layers soften your strong jawline while adding femininity.",
                    features: "Gentle waves, face-framing layers, medium to long length"
                },
                {
                    name: "Side Part with Layers",
                    reason: "A deep side part creates asymmetry that softens angular features.",
                    features: "Off-center part, cascading layers, soft texture"
                },
                {
                    name: "Textured Shag",
                    reason: "The shag's layers and movement balance your strong bone structure.",
                    features: "Lots of layers, textured fringe, lived-in look"
                }
            ],
            heart: [
                {
                    name: "Chin-Length Bob",
                    reason: "A bob that hits at the chin adds width to balance your narrower jawline.",
                    features: "Chin-length, full at bottom, soft edges"
                },
                {
                    name: "Long Layers with Side Bangs",
                    reason: "Side bangs minimize forehead width while layers add fullness below.",
                    features: "Graduated layers, side-swept fringe, medium to long length"
                },
                {
                    name: "Curtain Bangs",
                    reason: "Curtain bangs frame your face and draw attention to your cheekbones.",
                    features: "Center-parted fringe, face-framing layers, soft movement"
                }
            ],
            oblong: [
                {
                    name: "Medium Length with Bangs",
                    reason: "Bangs shorten the appearance of a long face while medium length adds width.",
                    features: "Full or side bangs, shoulder-length, volume on sides"
                },
                {
                    name: "Wavy Lob",
                    reason: "Waves add horizontal volume that balances a longer face shape.",
                    features: "Long bob, beach waves, textured styling"
                },
                {
                    name: "Layered Cut with Volume",
                    reason: "Strategic layering adds width and creates the illusion of a shorter face.",
                    features: "Layers at cheekbone level, full body, medium length"
                }
            ],
            diamond: [
                {
                    name: "Side-Swept Layers",
                    reason: "Adds fullness to your forehead and chin areas while softening cheekbones.",
                    features: "Side part, graduated layers, medium to long length"
                },
                {
                    name: "Textured Bob",
                    reason: "A textured bob adds width at the jawline to balance prominent cheekbones.",
                    features: "Chin-length or longer, textured ends, full bottom"
                },
                {
                    name: "Fringe with Soft Layers",
                    reason: "A fringe adds width to your forehead while layers soften angular features.",
                    features: "Wispy fringe, soft layers, face-framing pieces"
                }
            ]
        }
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            setImagePreview(URL.createObjectURL(file))
            setRecommendations(null)
            setFaceShape(null)
            setError(null)
        }
    }

    const analyzeImage = async () => {
        if (!selectedImage) return

        setIsLoading(true)
        setError(null)

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY })

            // Convert image to base64
            const reader = new FileReader()

            reader.onload = async () => {
                try {
                    const base64Data = reader.result.split(',')[1]

                    const prompt = `Analyze this person's face shape. Look at the proportions of the face:
- Forehead width
- Cheekbone width
- Jawline width
- Face length (from hairline to chin)

Based on these proportions, determine which face shape this person has. Choose ONLY ONE from these options:
- oval (balanced proportions, slightly longer than wide)
- round (similar width and length, soft features)
- square (strong jawline, similar width across forehead and jaw)
- heart (wider forehead, narrower chin)
- oblong (noticeably longer than wide)
- diamond (prominent cheekbones, narrower forehead and jaw)

Respond with ONLY a JSON object in this exact format (no markdown, no extra text):
{"faceShape": "the shape you detected"}

Be accurate and consider the actual bone structure, not hairstyle.`

                    const response = await ai.models.generateContent({
                        model: 'gemini-2.0-flash',
                        contents: [
                            {
                                role: 'user',
                                parts: [
                                    { text: prompt },
                                    {
                                        inlineData: {
                                            mimeType: selectedImage.type,
                                            data: base64Data
                                        }
                                    }
                                ]
                            }
                        ]
                    })

                    const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text
                    // console.log('Gemini Response:', textResponse)

                    // Parse the JSON response
                    const jsonMatch = textResponse.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                        const parsedData = JSON.parse(jsonMatch[0])
                        const detectedShape = parsedData.faceShape.toLowerCase()

                        // console.log('Detected Face Shape:', detectedShape)

                        if (haircutsByFaceShape[gender][detectedShape]) {
                            setFaceShape(detectedShape)
                            setRecommendations(haircutsByFaceShape[gender][detectedShape])
                        } else {
                            setError('Could not determine face shape. Please try another photo.')
                        }
                    } else {
                        throw new Error('Could not parse response')
                    }
                } catch (err) {
                    console.error('Error in analysis:', err)
                    setError('Failed to analyze image. Please try again.')
                }
                setIsLoading(false)
            }

            reader.onerror = () => {
                setError('Failed to read image file')
                setIsLoading(false)
            }

            reader.readAsDataURL(selectedImage)

        } catch (err) {
            console.error('Error analyzing image:', err)
            setError('Failed to analyze image. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="recommendationsContainer">
            <h1>AI Haircut Recommendations</h1>
            <p className="subtitle">Upload a photo and get personalized haircut suggestions based on your face shape</p>

            {!recommendations && (
                <div className="genderSelection">
                    <p>Select your gender:</p>
                    <div className="genderButtons">
                        <button
                            className={`genderButton ${gender === 'male' ? 'selected' : ''}`}
                            onClick={() => setGender('male')}
                        >
                            Male
                        </button>
                        <button
                            className={`genderButton ${gender === 'female' ? 'selected' : ''}`}
                            onClick={() => setGender('female')}
                        >
                            Female
                        </button>
                    </div>
                </div>
            )}

            {gender && (
                <div className="uploadSection">
                    <label htmlFor="imageUpload" className="uploadLabel">
                    {imagePreview ? (
                        <img
                            ref={imageRef}
                            src={imagePreview}
                            alt="Preview"
                            className="imagePreview"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="uploadPlaceholder">
                            <span className="uploadIcon">+</span>
                            <span>Click to upload your photo</span>
                        </div>
                    )}
                </label>
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                </div>
            )}

            {selectedImage && !isLoading && !recommendations && gender && (
                <button className="analyzeButton" onClick={analyzeImage}>
                    Analyze My Face Shape
                </button>
            )}

            {isLoading && (
                <div className="loadingSection">
                    <div className="spinner"></div>
                    <p>Analyzing your face shape...</p>
                </div>
            )}

            {error && (
                <div className="errorMessage">
                    {error}
                </div>
            )}

            {recommendations && faceShape && (
                <div className="resultsSection">
                    <h2>Your Face Shape: <span className="faceShapeText">{faceShape.charAt(0).toUpperCase() + faceShape.slice(1)}</span></h2>

                    <div className="recommendationsList">
                        {recommendations.map((rec, index) => (
                            <div key={index} className="recommendationCard">
                                <h3>{index + 1}. {rec.name}</h3>
                                <p className="reason"><strong>Why it suits you:</strong> {rec.reason}</p>
                                <p className="features"><strong>Key features:</strong> {rec.features}</p>
                            </div>
                        ))}
                    </div>

                    <button className="resetButton" onClick={() => {
                        setSelectedImage(null)
                        setImagePreview(null)
                        setRecommendations(null)
                        setFaceShape(null)
                        setGender(null)
                    }}>
                        Try Another Photo
                    </button>
                </div>
            )}
        </div>
    )
}
