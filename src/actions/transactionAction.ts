import axios from 'axios'
import {Transaction} from '../types/Transaction'
import {Dispatch} from 'redux'
import {
  CATEGORY_MESSAGE,
  FOUND_TRANSACTIONS,
  FOUND_TRANSACTIONS_BY_CATEGORY,
  PLACES_RECEIVED,
  REQUEST_ERROR,
  TRANSACTION_CREATED,
  TRANSACTION_DELETED,
  TRANSACTION_FAIL,
  TRANSACTION_MESSAGE,
  TRANSACTION_SUCCESS,
  TRANSACTION_UPDATED,
  TransactionActionTypes,
  TRANSACTIONS_RECEIVED
} from './types/TransactionActionTypes'
import {Msg} from '../types/Msg'
import {tokenConfig} from './authActions'
import {AppState} from '../store'
import {CreateTransaction} from '../types/CreateTransaction'

export const transactionSuccess = (transaction: Transaction): TransactionActionTypes => ({
  type: TRANSACTION_SUCCESS,
  transaction: transaction
})

export const transactionFail = (message: Msg, status: number): TransactionActionTypes => ({
  type: TRANSACTION_FAIL,
  payload: {message, status}
})

export const transactionsReceived = (transactions: Transaction[]): TransactionActionTypes => ({
  type: TRANSACTIONS_RECEIVED,
  transactions: transactions
})

export const transactionUpdated = (transaction: Transaction): TransactionActionTypes => ({
  type: TRANSACTION_UPDATED,
  transaction: transaction
})

export const transactionCreated = (transaction: Transaction): TransactionActionTypes => ({
  type: TRANSACTION_CREATED,
  transaction: transaction
})

export const transactionDeleted = (transaction: Transaction): TransactionActionTypes => ({
  type: TRANSACTION_DELETED,
  transaction: transaction
})

export const transactionsFound = (transactions: Transaction[] | null): TransactionActionTypes => ({
  type: FOUND_TRANSACTIONS,
  transactions: transactions
})

export const transactionsFoundByCategory = (transactions: Transaction[]): TransactionActionTypes => ({
  type: FOUND_TRANSACTIONS_BY_CATEGORY,
  transactions: transactions
})

export const transactionMsg = (msg: string): TransactionActionTypes => ({
  type: TRANSACTION_MESSAGE,
  msg: msg
})

export const categoryMsg = (msg: string): TransactionActionTypes => ({
  type: CATEGORY_MESSAGE,
  msg: msg
})

export const placesReceived = (places: string[]): TransactionActionTypes => ({
  type: PLACES_RECEIVED,
  places: places
})

export const requestError = (err: any): TransactionActionTypes => ({
  type: REQUEST_ERROR,
  err: err
})

export const newTransaction = (transaction: CreateTransaction) => (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
  axios
    .post('api/transaction/new', {transaction: transaction}, tokenConfig(getState))
    .then(res => {
        dispatch(transactionSuccess(res.data))
      }
    )
    .catch(err => {
      dispatch(transactionFail(err.data, err.status))
    })
}

export const getTransactions = () => (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
  axios.get('api/transaction/get', tokenConfig(getState))
    .then(res => {
      dispatch(transactionsReceived(res.data))
    })
    .catch(err => {
      dispatch(transactionFail(err, err))
    })
}

export const updateTransaction = (transaction: Transaction) =>
  (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
    axios.post('api/transaction/update', {transaction: transaction}, tokenConfig(getState))
      .then(res => {
        dispatch(transactionUpdated(res.data))
      })
      .catch(err => {
        console.error(err)
      })
  }

export const deleteTransaction = (transactionId: string) =>
  (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
    axios.delete('api/transaction/delete/' + transactionId, tokenConfig(getState))
      .then(res => {
        dispatch(transactionDeleted(res.data))
      })
      .catch(err => {
        console.error(err)
      })
  }

export const search = (searchText?: string, transactionType?: string, category?: string, place?: string, startDate?: Date, endDate?: Date) =>
  (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
    axios.post('api/search/transaction/', {
      searchText,
      transactionType,
      category,
      place,
      startDate,
      endDate
    }, tokenConfig(getState))
      .then(res => {
        if (res.data.msg) {
          dispatch(transactionMsg(res.data.msg))
          dispatch(transactionsFound([]))
        } else {
          dispatch(transactionsFound(res.data))
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

export const getPlaces = (place: string) => (dispatch: Dispatch<TransactionActionTypes>, getState: () => AppState) => {
  axios.post('api/search/place', {place}, tokenConfig(getState))
    .then(res => {
      console.log(res.data)
      dispatch(placesReceived(res.data))
    })
    .catch(err => {
      dispatch(requestError(err))
    })
}