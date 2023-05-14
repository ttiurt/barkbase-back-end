import { Profile } from "../models/profile.js"
import { Report } from "../models/report.js"

async function create(req, res) {
  try {
    req.body.owner = req.user.profile 
    const report = await Report.create(req.body)
    const profile = await Profile.findByIdAndUpdate(
      req.user.profile,
      { $push: {reports: report } },
      { new: true }
    )
    report.author = profile._id
    res.status(201).json(report)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)    
  }
}

async function index(req, res) {
  try {
    const reports = await Report.find({})
      .populate('author')
      .sort({ createdAt: 'desc' })
    res.status(200).json(reports)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function show(req, res) {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate(['author'])
    res.status(200).json(report)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function update(req, res) {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      req.body,
      { new: true }
    ).populate('author')
    res.status(200).json(report)
  } catch (error) {
    res.status(500).json(error)
  }
}

async function deleteReport(req, res) {
  try {
    const report = await Report.findByIdAndDelete(req.params.reportId)
    const profile = await Profile.findById(req.user.profile)
    profile.reports.remove({ _id: req.params.reportId })
    await profile.save()
    res.status(200).json(report)
  } catch (error) {
    res.status(500).json(error)
  }
}

export {
  create,
  index,
  show,
  update,
  deleteReport as delete,
}