const kue = require('kue')
const redisConfig = require('../../config/redis')
const jobs = require('../jobs')

const Queue = kue.createQueue({ redis: redisConfig })

Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle) // Passa a key do job

/*
Estamos dizendo para o node:
processar a fila pra todos os jobs que tenha a key 'PurchaseMail' (que está no arquivo '../jobs/PurchaseMail.js')
e chamar o método 'handle' que está no mesmo arquivo ali.
*/

module.exports = Queue
