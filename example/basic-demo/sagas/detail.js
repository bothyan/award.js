import { call, put, take, takeEvery, takeLatest } from 'redux-saga/effects'
import { RECEIVE_TODO_DETAIL } from '../actions'
import axios from 'axios'

function* getTodoDetail(action) { 
    try {
        const { data: { todoDetail } } = yield call(axios.get, 'http://localhost:4000/todo_detail')
        yield put(RECEIVE_TODO_DETAIL(todoDetail))

    } catch (error) {
        yield put(RECEIVE_TODO_DETAIL(error))
    }
}

export default function* () {
    yield takeEvery('/get_todo_detail', getTodoDetail)
}
