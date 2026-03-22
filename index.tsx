import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState('')
  const [operation, setOperation] = useState('')
  const [newNumber, setNewNumber] = useState(true)
  const [history, setHistory] = useState<Array<{ expression: string; result: string }>>([])
  const [showHistory, setShowHistory] = useState(false)

  // Handle number input
  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  // Handle decimal point
  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  // Handle clear
  const handleClear = () => {
    setDisplay('0')
    setPreviousValue('')
    setOperation('')
    setNewNumber(true)
  }

  // Handle delete last character
  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0')
      setNewNumber(true)
    } else {
      setDisplay(display.slice(0, -1))
    }
  }

  // Handle percentage
  const handlePercentage = () => {
    const current = parseFloat(display)
    setDisplay((current / 100).toString())
    setNewNumber(true)
  }

  // Handle sign change (+/-)
  const handleSignChange = () => {
    const current = parseFloat(display)
    setDisplay((current * -1).toString())
  }

  // Add to history
  const addToHistory = (expression: string, result: string) => {
    setHistory(prev => [{ expression, result }, ...prev].slice(0, 10))
  }

  // Clear history
  const clearHistory = () => {
    setHistory([])
  }

  // Perform calculation
  const calculate = () => {
    if (!previousValue || !operation) return

    const prev = parseFloat(previousValue)
    const current = parseFloat(display)
    let result = 0
    const expression = `${previousValue} ${operation} ${display}`

    switch (operation) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '×':
        result = prev * current
        break
      case '÷':
        if (current === 0) {
          setDisplay('Error')
          setTimeout(() => handleClear(), 1500)
          return
        }
        result = prev / current
        break
      default:
        return
    }

    const resultStr = result.toString().slice(0, 12)
    setDisplay(resultStr)
    addToHistory(expression, resultStr)
    setPreviousValue('')
    setOperation('')
    setNewNumber(true)
  }

  // Handle operation selection
  const handleOperation = (op: string) => {
    if (previousValue && operation && !newNumber) {
      calculate()
    }
    setPreviousValue(display)
    setOperation(op)
    setNewNumber(true)
  }

  // Handle equals
  const handleEquals = () => {
    if (previousValue && operation) {
      calculate()
    }
  }

  // Load from history
  const loadFromHistory = (result: string) => {
    setDisplay(result)
    setNewNumber(true)
    setShowHistory(false)
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key
      
      if (/[0-9]/.test(key)) {
        handleNumber(key)
      } else if (key === '+') {
        handleOperation('+')
      } else if (key === '-') {
        handleOperation('-')
      } else if (key === '*') {
        handleOperation('×')
      } else if (key === '/') {
        e.preventDefault()
        handleOperation('÷')
      } else if (key === 'Enter' || key === '=') {
        handleEquals()
      } else if (key === 'Escape') {
        handleClear()
      } else if (key === 'Backspace') {
        handleDelete()
      } else if (key === '.') {
        handleDecimal()
      } else if (key === '%') {
        handlePercentage()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [display, previousValue, operation, newNumber])

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    },
    calculator: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '30px',
      padding: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      width: '100%',
      maxWidth: '400px'
    },
    display: {
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '20px',
      padding: '20px',
      marginBottom: '20px',
      textAlign: 'right' as const,
      color: 'white',
      wordWrap: 'break-word' as const,
      wordBreak: 'break-all' as const,
      minHeight: '120px'
    },
    previousOperation: {
      fontSize: '1.2rem',
      color: 'rgba(255, 255, 255, 0.7)',
      minHeight: '32px',
      marginBottom: '10px'
    },
    currentDisplay: {
      fontSize: '3rem',
      fontWeight: '500',
      overflowX: 'auto' as const,
      whiteSpace: 'nowrap' as const
    },
    buttons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(5px)',
      border: 'none',
      borderRadius: '15px',
      fontSize: '1.5rem',
      padding: '20px',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500'
    },
    operator: {
      background: 'rgba(255, 165, 0, 0.8)',
      fontSize: '1.8rem'
    },
    clear: {
      background: 'rgba(255, 69, 0, 0.8)'
    },
    delete: {
      background: 'rgba(255, 0, 0, 0.8)'
    },
    equals: {
      background: 'rgba(0, 128, 0, 0.8)',
      fontSize: '1.8rem'
    },
    zero: {
      gridColumn: 'span 2'
    },
    historyToggle: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      marginBottom: '15px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      width: '100%'
    },
    historyPanel: {
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '20px',
      padding: '20px',
      minHeight: '500px'
    },
    historyHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      color: 'white'
    },
    historyList: {
      maxHeight: '400px',
      overflowY: 'auto' as const
    },
    historyItem: {
      background: 'rgba(255, 255, 255, 0.1)',
      marginBottom: '10px',
      padding: '12px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    historyExpression: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '0.9rem',
      marginBottom: '5px'
    },
    historyResult: {
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: 'bold'
    },
    noHistory: {
      textAlign: 'center' as const,
      color: 'rgba(255, 255, 255, 0.5)',
      padding: '40px'
    }
  }

  return (
    <>
      <Head>
        <title>Calculator App</title>
        <meta name="description" content="Modern calculator with history" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.calculator}>
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            style={styles.historyToggle}
          >
            {showHistory ? '← Back to Calculator' : '📜 History'}
          </button>

          {!showHistory ? (
            <>
              {/* Display */}
              <div style={styles.display}>
                <div style={styles.previousOperation}>
                  {previousValue} {operation}
                </div>
                <div style={styles.currentDisplay}>{display}</div>
              </div>

              {/* Buttons */}
              <div style={styles.buttons}>
                <button onClick={handleClear} style={{...styles.button, ...styles.clear}}>
                  AC
                </button>
                <button onClick={handleSignChange} style={{...styles.button, ...styles.operator}}>
                  +/-
                </button>
                <button onClick={handlePercentage} style={{...styles.button, ...styles.operator}}>
                  %
                </button>
                <button onClick={() => handleOperation('÷')} style={{...styles.button, ...styles.operator}}>
                  ÷
                </button>

                <button onClick={() => handleNumber('7')} style={styles.button}>7</button>
                <button onClick={() => handleNumber('8')} style={styles.button}>8</button>
                <button onClick={() => handleNumber('9')} style={styles.button}>9</button>
                <button onClick={() => handleOperation('×')} style={{...styles.button, ...styles.operator}}>
                  ×
                </button>

                <button onClick={() => handleNumber('4')} style={styles.button}>4</button>
                <button onClick={() => handleNumber('5')} style={styles.button}>5</button>
                <button onClick={() => handleNumber('6')} style={styles.button}>6</button>
                <button onClick={() => handleOperation('-')} style={{...styles.button, ...styles.operator}}>
                  -
                </button>

                <button onClick={() => handleNumber('1')} style={styles.button}>1</button>
                <button onClick={() => handleNumber('2')} style={styles.button}>2</button>
                <button onClick={() => handleNumber('3')} style={styles.button}>3</button>
                <button onClick={() => handleOperation('+')} style={{...styles.button, ...styles.operator}}>
                  +
                </button>

                <button onClick={() => handleNumber('0')} style={{...styles.button, ...styles.zero}}>
                  0
                </button>
                <button onClick={handleDecimal} style={styles.button}>.</button>
                <button onClick={handleDelete} style={{...styles.button, ...styles.delete}}>
                  ⌫
                </button>
                <button onClick={handleEquals} style={{...styles.button, ...styles.equals}}>
                  =
                </button>
              </div>
            </>
          ) : (
            <div style={styles.historyPanel}>
              <div style={styles.historyHeader}>
                <h3 style={{margin: 0}}>Calculation History</h3>
                <button 
                  onClick={clearHistory} 
                  style={{
                    background: 'rgba(255, 69, 0, 0.8)',
                    border: 'none',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              </div>
              <div style={styles.historyList}>
                {history.length === 0 ? (
                  <p style={styles.noHistory}>No calculations yet</p>
                ) : (
                  history.map((item, index) => (
                    <div 
                      key={index} 
                      style={styles.historyItem}
                      onClick={() => loadFromHistory(item.result)}
                    >
                      <div style={styles.historyExpression}>{item.expression}</div>
                      <div style={styles.historyResult}>= {item.result}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        @keyframes ripple {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        button:active {
          animation: ripple 0.2s ease;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </>
  )
}
