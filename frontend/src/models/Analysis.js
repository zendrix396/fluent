import mongoose from 'mongoose';

const { Schema } = mongoose;

const analysisSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: false
  },
  dataPoints: {
    type: Number,
    required: true
  },
  analysisType: {
    type: String,
    enum: ['file', 'manual'],
    required: true
  },
  functions: {
    type: [String],
    required: true
  },
  accuracy: {
    type: String,
    required: false
  },
  accuracies: {
    type: [String],
    required: false
  },
  xColumns: {
    type: [String],
    required: false
  },
  yColumns: {
    type: [String],
    required: false
  },
  polyDegree: {
    type: Number,
    default: 1
  },
  fileSize: {
    type: Number,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Analysis || mongoose.model("Analysis", analysisSchema);
