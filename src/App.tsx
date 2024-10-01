import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import './index.css'

const allLetters = 'etaoinshrdlcumwfgypbvkjxqz'
const initialUnlockedLetters = 'etaoin'

const wordList = [
  'a', 'an', 'at', 'as', 'and', 'are',
  'be', 'by',
  'do',
  'eat', 'end',
  'for', 'from',
  'get', 'go',
  'have', 'he', 'her', 'his',
  'in', 'is', 'it',
  'let',
  'me', 'my',
  'no', 'not',
  'of', 'on', 'or', 'our',
  'put',
  'run',
  'say', 'see', 'she', 'so',
  'the', 'they', 'to',
  'up', 'us', 'use',
  'we', 'who', 'with',
  'you', 'your',
  'about', 'after',
  'back', 'been', 'before',
  'call', 'can', 'come', 'could',
  'down',
  'find', 'first',
  'give', 'good',
  'hand', 'has', 'here', 'how',
  'just',
  'know',
  'like', 'look',
  'make', 'many', 'more', 'most',
  'new', 'now',
  'only', 'other', 'over',
  'people',
  'right',
  'same', 'see', 'some',
  'take', 'than', 'that', 'their', 'them', 'then', 'there', 'these', 'think', 'time', 'two',
  'want', 'way', 'well', 'what', 'when', 'which', 'will', 'work', 'would',
  'year',
  'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog',
  'pack', 'my', 'box', 'with', 'five', 'dozen', 'liquor', 'jugs',
  'how', 'vexingly', 'daft', 'zebras', 'jump',
  'waltz', 'nymph', 'for', 'jigs', 'vex', 'bud',
  'sphinx', 'of', 'black', 'quartz', 'judge', 'vow',
  'fix', 'problem', 'quickly', 'galvanized', 'jets'
]

const generateText = (unlockedLetters: string, lastLetterMastered: boolean, wordCount: number = 10) => {
  const lastUnlockedLetter = unlockedLetters[unlockedLetters.length - 1]
  const isInitialSet = unlockedLetters === initialUnlockedLetters
  const isAllUnlocked = unlockedLetters === allLetters

  let availableWords = wordList.filter(word => 
    word.split('').every(letter => unlockedLetters.includes(letter))
  )

  if (!isInitialSet && !isAllUnlocked && !lastLetterMastered) {
    availableWords = availableWords.filter(word => word.includes(lastUnlockedLetter))
  }

  if (availableWords.length === 0) {
    return generateRandomLetters(unlockedLetters, wordCount * 5)
  }

  let generatedText = []
  for (let i = 0; i < wordCount; i++) {
    generatedText.push(availableWords[Math.floor(Math.random() * availableWords.length)])
  }

  return generatedText.join(' ')
}

const generateRandomLetters = (unlockedLetters: string, length: number) => {
  return Array.from({ length }, () => 
    unlockedLetters[Math.floor(Math.random() * unlockedLetters.length)]
  ).join('')
}

function App() {
  const [unlockedLetters, setUnlockedLetters] = useState(initialUnlockedLetters)
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [wpm, setWpm] = useState(0)
  const [lastLetterMastered, setLastLetterMastered] = useState(true)

  const generateNewText = useCallback(() => {
    const newText = generateText(unlockedLetters, lastLetterMastered)
    setText(newText)
    setUserInput('')
    setStartTime(null)
    setWordCount(0)
    setCharCount(0)
    setAccuracy(100)
    setWpm(0)
  }, [unlockedLetters, lastLetterMastered])

  useEffect(() => {
    generateNewText()
  }, [generateNewText])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    setUserInput(inputValue)

    if (!startTime) {
      setStartTime(Date.now())
    }

    const words = inputValue.trim().split(/\s+/)
    setWordCount(words.length)

    const accurateChars = inputValue.split('').filter((char, index) => char === text[index]).length
    setCharCount(accurateChars)
    setAccuracy(Math.round((accurateChars / inputValue.length) * 100) || 100)

    const timeElapsed = (Date.now() - (startTime || Date.now())) / 60000 // in minutes
    const currentWpm = Math.round((words.length / timeElapsed) || 0)
    setWpm(currentWpm)

    // Check if user has completed the text with high accuracy and WPM
    if (inputValue.length === text.length && accuracy >= 95) {
      if (currentWpm >= 30) {
        if (!lastLetterMastered) {
          setLastLetterMastered(true)
        } else if (unlockedLetters !== allLetters) {
          unlockNextLetter()
        }
      }
      generateNewText()
    }
  }

  const unlockNextLetter = () => {
    const nextLetterIndex = allLetters.indexOf(unlockedLetters[unlockedLetters.length - 1]) + 1
    if (nextLetterIndex < allLetters.length) {
      setUnlockedLetters(allLetters.slice(0, nextLetterIndex + 1))
      setLastLetterMastered(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Progressive Touch Typing Trainer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center gap-1" aria-label="Unlocked letters">
            {allLetters.split('').map((letter, index) => (
              <span
                key={letter}
                className={`w-6 h-6 flex items-center justify-center rounded ${
                  unlockedLetters.includes(letter) 
                    ? lastLetterMastered || letter !== unlockedLetters[unlockedLetters.length - 1]
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
          <Progress 
            value={(unlockedLetters.length / allLetters.length) * 100} 
            className="w-full"
          />
          <div className="text-lg font-medium bg-muted p-4 rounded" aria-label="Sample text to type">
            {text}
          </div>
          <textarea
            className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            aria-label="Type the sample text here"
          />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Words per minute</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
          </div>
          <Button onClick={generateNewText} className="w-full">
            New Text
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
export default App;
