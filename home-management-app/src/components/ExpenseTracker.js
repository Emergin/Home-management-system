import React, { useState, useEffect } from 'react';

const ExpenseTracker = () => {
  const [userId, setUserId] = useState(null);
  const [expenses, setExpenses] = useState({
    userId: '',
    income: '',
    shopping: '',
    rent: '',
    houseManager: '',
    schoolFees: '',
    miscellaneous: ''
  });
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  // Styles object
  const styles = {
    container: {
      maxWidth: '500px',
      margin: '20px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '24px',
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '25px',
      fontWeight: 'bold',
      borderBottom: '2px solid #eee',
      paddingBottom: '15px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      color: '#34495e',
      fontWeight: '600',
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      outline: 'none',
      '&:focus': {
        borderColor: '#3498db',
        boxShadow: '0 0 0 2px rgba(52, 152, 219, 0.2)',
      },
    },
    buttonGroup: {
      display: 'flex',
      gap: '15px',
      marginTop: '20px',
    },
    button: {
      flex: '1',
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'transform 0.1s ease, background-color 0.3s ease',
    },
    submitButton: {
      backgroundColor: '#3498db',
      color: 'white',
      '&:hover': {
        backgroundColor: '#2980b9',
        transform: 'translateY(-1px)',
      },
    },
    resetButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      '&:hover': {
        backgroundColor: '#7f8c8d',
        transform: 'translateY(-1px)',
      },
    },
    results: {
      marginTop: '30px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      border: '1px solid #eee',
    },
    summaryHeader: {
      fontSize: '20px',
      color: '#2c3e50',
      marginBottom: '15px',
      fontWeight: '600',
    },
    summaryItem: {
      marginBottom: '10px',
      fontSize: '16px',
      color: '#34495e',
    },
    balance: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginTop: '15px',
      padding: '10px',
      borderRadius: '8px',
    },
    balancePositive: {
      color: '#27ae60',
      backgroundColor: '#e8f6e9',
    },
    balanceNegative: {
      color: '#c0392b',
      backgroundColor: '#fadbd8',
    },
    advice: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: '#ebf5fb',
      borderRadius: '8px',
      border: '1px solid #bed4e7',
    },
    adviceHeader: {
      fontSize: '16px',
      color: '#2980b9',
      marginBottom: '10px',
      fontWeight: '600',
    },
    adviceText: {
      fontSize: '14px',
      color: '#34495e',
      lineHeight: '1.5',
    },
    errorContainer: {
      padding: '15px',
      backgroundColor: '#ffebee',
      color: '#c62828',
      borderRadius: '8px',
      marginBottom: '15px',
      border: '1px solid #ffcdd2',
    },
    userIdDisplay: {
      padding: '10px',
      backgroundColor: '#f5f6fa',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '14px',
      color: '#606060',
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setExpenses(prev => ({
        ...prev,
        userId: storedUserId
      }));
    } else {
      setError('User ID not found. Please log in.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenses(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }));
  };

  const calculateBalance = () => {
    const total = expenses.income - (
      (expenses.shopping || 0) +
      (expenses.rent || 0) +
      (expenses.houseManager || 0) +
      (expenses.schoolFees || 0) +
      (expenses.miscellaneous || 0)
    );
    return total;
  };

  const getFinancialAdvice = (balance) => {
    if (balance > 0) {
      if (balance > expenses.income * 0.3) {
        return "Great job managing your finances! Consider investing the surplus in a retirement fund or emergency savings. The 50/30/20 rule suggests using 50% for needs, 30% for wants, and 20% for savings/investments.";
      }
      return "You're staying within your budget, which is positive! Consider setting aside some of your remaining money for emergency savings if you haven't already.";
    } else if (balance === 0) {
      return "You're breaking even. Consider reviewing your expenses to create some buffer for savings and emergencies.";
    } else {
      return "Your expenses exceed your income. Consider creating a stricter budget, finding additional income sources, or reducing non-essential expenses. Focus first on essential needs like housing and food.";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please log in to track expenses.');
      return;
    }
    setShowResults(true);
  };

  const resetForm = () => {
    setExpenses({
      userId,
      income: '',
      shopping: '',
      rent: '',
      houseManager: '',
      schoolFees: '',
      miscellaneous: ''
    });
    setShowResults(false);
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Monthly Expense Tracker</h2>
      
      <div style={styles.userIdDisplay}>
        User ID: {userId}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Monthly Income</label>
          <input
            type="number"
            name="income"
            value={expenses.income}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Shopping Expenses</label>
          <input
            type="number"
            name="shopping"
            value={expenses.shopping}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Rent</label>
          <input
            type="number"
            name="rent"
            value={expenses.rent}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>House Manager Salary</label>
          <input
            type="number"
            name="houseManager"
            value={expenses.houseManager}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>School Fees</label>
          <input
            type="number"
            name="schoolFees"
            value={expenses.schoolFees}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Miscellaneous Expenses</label>
          <input
            type="number"
            name="miscellaneous"
            value={expenses.miscellaneous}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{...styles.button, ...styles.submitButton}}
          >
            Calculate Balance
          </button>
          <button
            type="button"
            onClick={resetForm}
            style={{...styles.button, ...styles.resetButton}}
          >
            Reset
          </button>
        </div>
      </form>

      {showResults && (
        <div style={styles.results}>
          <h3 style={styles.summaryHeader}>Monthly Summary</h3>
          <p style={styles.summaryItem}>
            Total Income: ${expenses.income.toLocaleString()}
          </p>
          <p style={styles.summaryItem}>
            Total Expenses: ${(expenses.income - calculateBalance()).toLocaleString()}
          </p>
          <p style={{
            ...styles.balance,
            ...(calculateBalance() >= 0 ? styles.balancePositive : styles.balanceNegative)
          }}>
            Remaining Balance: ${calculateBalance().toLocaleString()}
          </p>
          <div style={styles.advice}>
            <h4 style={styles.adviceHeader}>Financial Advice:</h4>
            <p style={styles.adviceText}>
              {getFinancialAdvice(calculateBalance())}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;